import os
from datetime import datetime

from bson.objectid import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient

from models import Contract, UserInDB, UserWithContracts

load_dotenv()

DB_URL = os.getenv("DB_URL")
DB_NAME = os.getenv("DB_NAME")

if not DB_URL or not DB_NAME:
    raise ValueError("DB_URL and DB_NAME must be set")

client = MongoClient(DB_URL)
db = client[DB_NAME]
users_collection = db["users"]


def get_user(username: str):
    user_data = users_collection.find_one({"username": username})
    return UserWithContracts(**user_data) if user_data else None


def upsert_user(user: UserInDB):
    return users_collection.update_one(
        {"username": user.username}, {"$set": user.dict()}, upsert=True
    )


def get_formatted_time():
    from datetime import datetime


def get_formatted_time(timestamp: datetime):
    # Get day with suffix
    day = timestamp.day
    suffix = (
        "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    )

    # Get AM or PM
    am_or_pm = "am" if timestamp.hour < 12 else "pm"

    # Format time in 12-hour format
    hour_12_format = timestamp.strftime("%I:%M").lstrip("0")

    # Form the complete string
    formatted_time = timestamp.strftime(
        f"%B {day}{suffix}, {hour_12_format} {am_or_pm}"
    )

    return formatted_time


def save_contract(username: str, document_text: str):
    contract = Contract(id=str(ObjectId()), text=document_text)
    return users_collection.update_one(
        {"username": username}, {"$push": {"contracts": contract.dict()}}
    )


def get_contracts(username: str):
    user = get_user(username)
    if not user:
        return None
    contracts_info = []
    for contract in user.contracts:
        creation_time = get_formatted_time(ObjectId(contract.id).generation_time)
        contracts_info.append({"id": contract.id, "created_at": creation_time})
    return contracts_info


def get_contract(username: str, contract_id: str):
    user = get_user(username)
    if user:
        for contract in user.contracts:
            if contract.id == contract_id:
                return contract
    return None