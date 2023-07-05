import hashlib

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse
from starlette.status import HTTP_429_TOO_MANY_REQUESTS

from models import ContractDetails
from services.openai_operations import fill_in_template, generate_contract
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
@limiter.limit("2/minute")  # limit to 10 requests per minute
async def draft_contract(details: ContractDetails, request: Request):
    """
    This function is the main endpoint that receives the contract details,
    generates a contract, and returns it.
    """
    hash_key = hashlib.sha256(
        f"{details.agreement_type}-{details.governing_law}".encode()
    ).hexdigest()
    print(f"hash_key ={hash_key}")
    template = None
    template = read_from_redis(hash_key)
    if not template:
        # template = employment_california_template
        template = generate_contract(details)
        cache_in_redis(hash_key, template)

    contract = fill_in_template(template, details)
    return {"message": contract}
