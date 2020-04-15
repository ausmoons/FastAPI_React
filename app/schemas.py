from pydantic import BaseModel


class UserInfoBase(BaseModel):
    username: str


class UserCreate(UserInfoBase):
    name: str
    password: str


class UserAuthenticate(UserInfoBase):
    password: str


class UserInfo(UserInfoBase):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str = None


class ContactBase(BaseModel):
    fullName: str
    country: str
    phone: str
    email: str


class Contact(ContactBase):
    id: int

    class Config:
        orm_mode = True


validSchema = {
    "type": "object",
    "required": ["country", "email", "fullName", "phone"],
    "properties": {
        "country": {"type": "string"},
        "email": {"type": "string", "format": "email"},
        "fullName": {"type": "string"},
        "phone": {"type": "string"},
    },
}


# def post(contact: Contact) -> Contact:
#     new_contactJson = request.get_json()
#     try:
#         validate(instance=new_contactJson, schema=validSchema)
#     except ValidationError:
#         raise ValidationError("There is a validation error in schema")
#         db.session.rollback()
#     fullName = new_contactJson["fullName"]
#     country = new_contactJson["country"]
#     phone = new_contactJson["phone"]
#     email = new_contactJson["email"]
#     try:
#         ContactValidator(fullName, country, phone, email)
#     except ValidationError:
#         raise ValidationError("There is a validation error")
