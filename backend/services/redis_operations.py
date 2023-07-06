import json
import os

from fastapi import HTTPException
from redis import Redis, RedisError

# Obtain a redis client from the provided URL
redis_client = Redis.from_url(os.getenv("REDIS_URI"))


def read_from_redis(hash_key):
    """
    This function reads a value from the Redis cache
    using a provided hash_key.
    """
    try:
        bytes_obj = redis_client.get(hash_key)
        if bytes_obj:
            return bytes_obj.decode("utf-8")
        return bytes_obj
    except RedisError as re:
        # If there is a Redis error, we throw an HTTPException with status code 500
        raise HTTPException(status_code=500, detail=f"Redis error: {str(re)}")


def cache_in_redis(hash_key, template):
    """
    This function writes a value to the Redis cache
    with a provided hash_key and template.
    """
    return redis_client.set(hash_key, json.dumps(template))
