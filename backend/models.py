from typing import List, Optional

from fastapi import Depends
from pydantic import BaseModel


class ContractDetails(BaseModel):
    agreement_type: str
    governing_law: str
    party_a: str
    party_b: str
    effective_date: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = False


class UserInDB(User):
    hashed_password: str


class Contract(BaseModel):
    id: str
    text: str


class UserWithContracts(UserInDB):
    contracts: Optional[List[Contract]] = []


class ContractSave(BaseModel):
    text: str


class ContractResponse(BaseModel):
    id: str
    created_at: str


class ContractClause(BaseModel):
    text: str
