from sqlalchemy.orm import Session
import models
import schemas
import bcrypt


def get_user_by_username(db: Session, username: str):
    return (
        db.query(models.UserInfo)
        .filter(models.UserInfo.username == username)
        .first()  # noqa
    )


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"), bcrypt.gensalt()
    )  # noqa
    db_user = models.UserInfo(
        username=user.username,
        password=hashed_password.decode("utf8"),
        name=user.name,  # noqa
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def check_username_password(db: Session, user: schemas.UserAuthenticate):
    db_user_info: models.UserInfo = get_user_by_username(
        db, username=user.username
    )  # noqa
    return bcrypt.checkpw(
        user.password.encode("utf-8"), db_user_info.password.encode("utf-8")
    )


def create_new_contact(db: Session, contact: schemas.ContactBase):
    db_contact = models.Contact(
        fullName=contact.fullName,
        country=contact.country,
        phone=contact.phone,
        email=contact.email,
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


def get_all_contacts(db: Session):
    return db.query(models.Contact).all()


def get_all_users(db: Session):
    return db.query(models.UserInfo).all()


def get_contact_by_id(db: Session, id: int):
    return db.query(models.Contact).filter(models.Contact.id == id).first()  # noqa


def get_user_by_id(db: Session, id: int):
    return db.query(models.UserInfo).filter(models.UserInfo.id == id).first()  # noqa


def delete_contact(db: Session, id: int):
    try:
        contact_to_delete = (
            db.query(models.Contact).filter(models.Contact.id == id).first()  # noqa
        )
        if not contact_to_delete:
            raise Exception
    except Exception:
        raise Exception("There isn't contact for which you are looking")
    db.delete(contact_to_delete)
    db.commit()
    return "You have deleted contact with id {}".format(id)


def delete_user(db: Session, id: int):
    try:
        user_to_delete = (
            db.query(models.UserInfo).filter(models.UserInfo.id == id).first()  # noqa
        )
        if not user_to_delete:
            raise Exception
    except Exception:
        raise Exception("There isn't contact for which you are looking")
    db.delete(user_to_delete)
    db.commit()
    return "You have deleted contact with id {}".format(id)
