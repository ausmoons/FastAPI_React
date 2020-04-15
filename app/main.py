import logging
from pydantic import BaseModel
from email_validator import validate_email, EmailNotValidError
from sqlalchemy.orm import Session
import crud
from fastapi import Depends, FastAPI, HTTPException
from crud import get_user_by_username
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm  # noqa
import models
from database import engine, SessionLocal
from starlette import status
from app_utils import decode_access_token
from jwt import PyJWTError
import uvicorn
import schemas
from schemas import UserInfo, TokenData, UserCreate, Token  # noqa

models.Base.metadata.create_all(bind=engine)


app = FastAPI()


def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {"message": "Hello World"}


ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/authenticate")

logging.basicConfig(
    level=logging.DEBUG,
    format="%(levelname)s %(message)s",
    filename="app.log",
    filemode="w",
)


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):  # noqa
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(data=token)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except PyJWTError:
        raise credentials_exception
    user = get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


class ContactValidator(BaseModel):
    @classmethod
    def __init__(self, fullName, country, phone, email):
        self.fullName: str = fullName
        self.country: str = country
        self.phone: str = phone
        self.email: str = email
        if not validate_email(email):
            raise EmailNotValidError
        if not country.isalpha():
            raise Exception("Country should contain only letters")
        if not fullName.replace(" ", "").isalpha():
            raise Exception("Full name should contain only letters")
        if " " not in fullName:
            raise Exception("Please write name and surname")
        if not phone.isdecimal():
            raise Exception("Phone number should contain only numbers")

    @app.get("/users")
    async def get_all_users(db: Session = Depends(get_db)):
        return crud.get_all_users(db=db)

    @app.post("/users", response_model=UserInfo)
    def create_user(user: UserCreate, db: Session = Depends(get_db)):
        db_user = crud.get_user_by_username(db, username=user.username)
        if db_user:
            raise HTTPException(
                status_code=400, detail="Username already registered"
            )  # noqa
        return crud.create_user(db=db, user=user)

    @app.get("/users/{id}")
    async def get_user(
        id, db: Session = Depends(get_db),
    ):  # noqa
        return crud.get_user_by_id(db=db, id=id)

    @app.delete("/users/{id}")
    async def delete_user(id, db: Session = Depends(get_db),) -> str:  # noqa
        return crud.delete_user(db=db, id=id)

    @app.post("/authenticate", response_model=schemas.Token)
    def authenticate_user(
        user: schemas.UserAuthenticate, db: Session = Depends(get_db)
    ):
        db_user = crud.get_user_by_username(db, username=user.username)
        if db_user is None:
            raise HTTPException(status_code=400, detail="Username not existed")
        else:
            is_password_correct = crud.check_username_password(db, user)
            if is_password_correct is False:
                raise HTTPException(
                    status_code=400, detail="Password is not correct"
                )  # noqa
            else:
                from datetime import timedelta

                access_token_expires = timedelta(
                    minutes=ACCESS_TOKEN_EXPIRE_MINUTES
                )  # noqa
                from app_utils import create_access_token

                access_token = create_access_token(
                    data={"sub": user.username},
                    expires_delta=access_token_expires,  # noqa
                )
                return {"access_token": access_token, "token_type": "Bearer"}


@app.get("/contacts")
async def get_all_contacts(
    current_user: UserInfo = Depends(get_current_user),
    db: Session = Depends(get_db),  # noqa
):
    return crud.get_all_contacts(db=db)


@app.post("/contacts", response_model=schemas.Contact)
async def create_new_contact(
    contact: schemas.ContactBase,
    current_user: UserInfo = Depends(get_current_user),
    db: Session = Depends(get_db),
):  # noqa
    return crud.create_new_contact(db=db, contact=contact)


@app.get("/contacts/{id}")
async def update_contact(
    id,
    current_user: UserInfo = Depends(get_current_user),
    db: Session = Depends(get_db),
):  # noqa
    return crud.get_contact_by_id(db=db, id=id)


@app.delete("/contacts/{id}")
async def delete(
    id,
    current_user: UserInfo = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> str:  # noqa
    return crud.delete_contact(db=db, id=id)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8081)
