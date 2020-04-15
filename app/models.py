from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Contact(Base):  # type: ignore
    __tablename__ = "contacts"

    id = Column(Integer, unique=True, nullable=False, primary_key=True)
    fullName = Column(String, unique=True, nullable=False)
    country = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)

    def __init__(self, fullName, country, phone, email):
        self.fullName = fullName
        self.country = country
        self.phone = phone
        self.email = email


class UserInfo(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)

    def __init__(self, username, name, password):
        self.username = username
        self.name = name
        self.password = password
