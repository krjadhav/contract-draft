import hashlib
import os
from datetime import timedelta
from typing import Annotated, List, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request, status
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse
from starlette.status import HTTP_429_TOO_MANY_REQUESTS

from auth import (OAuth2PasswordRequestForm, authenticate_user,
                  create_access_token, get_current_active_user,
                  get_password_hash)
from db import (get_contract, get_contracts, insert_user, save_contract,
                test_get_user, upsert_user)
from models import (Contract, ContractClause, ContractDetails,
                    ContractResponse, ContractSave, Token, User, UserInDB,
                    UserWithContracts)
from services.openai_operations import (fill_in_template, generate_clause,
                                        generate_contract)
from services.redis_operations import cache_in_redis, read_from_redis

load_dotenv()  # load environment variables from .env file
app = FastAPI()

async def _rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=HTTP_429_TOO_MANY_REQUESTS,
        content={
            "message": "Too many requests",
        },
    )


limiter = Limiter(
    key_func=get_remote_address
)  # use client IP address as the key for rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.post("/api/draft", status_code=200)
@limiter.limit("10/minute")  # limit to 10 requests per minute
async def draft_contract(
    details: ContractDetails,
    request: Request,
    current_user: UserWithContracts = Depends(get_current_active_user),
):
    """
    This function is the main endpoint that receives the contract details,
    generates a contract, and returns it.
    """
    hash_key = hashlib.sha256(
        f"{details.agreement_type}-{details.governing_law}".encode()
    ).hexdigest()

    template = None
    template = read_from_redis(hash_key)

    if not template:
        template = generate_contract(details)
        cache_in_redis(hash_key, template)

    contract = fill_in_template(template, details)
    # Save contract to db
    save_contract(current_user.username, contract)
    return {"message": contract}


@app.post("/api/contracts/clauses", status_code=200)
@limiter.limit("10/minute")  # limit to 10 requests per minute
async def get_clause(
    prompt: ContractClause,
    current_user: UserWithContracts = Depends(get_current_active_user),
):
    clause = generate_clause(prompt.text)
    return {"message": clause}


@app.post("/api/auth", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user, correctPassword = authenticate_user(form_data.username, form_data.password)
    if not user:
        hashed_password = get_password_hash(form_data.password)
        user_in = UserInDB(username=form_data.username, hashed_password=hashed_password)
        upsert_user(user_in)
        user = user_in
    elif not correctPassword:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(
        minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    )
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/contracts/save", status_code=200)
async def save_current_version(
    document: ContractSave,
    current_user: UserWithContracts = Depends(get_current_active_user),
):
    save_contract(current_user.username, document.text)
    return {"detail": "Contract saved"}


@app.get("/api/contracts", response_model=List[ContractResponse])
async def retrieve_contracts(
    current_user: UserWithContracts = Depends(get_current_active_user),
):
    contracts = get_contracts(current_user.username)
    if contracts is None:
        raise HTTPException(status_code=404, detail="No contracts found")
    return contracts


@app.get("/api/contract/{contract_id}", response_model=Contract)
async def retrieve_contract(
    contract_id: str, current_user: UserWithContracts = Depends(get_current_active_user)
):
    contract = get_contract(current_user.username, contract_id)
    if contract is None:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract

