import secrets
import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException
from uuid import uuid4


from passlib.context import CryptContext
from jose import jwt, JWTError
from starlette.concurrency import run_in_threadpool
from bson import ObjectId

from app.config import settings
from app.utils.db import db

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

ALGORITHM = settings.ALGORITHM
SECRET_KEY = settings.SECRET_KEY


async def hash_password(password: str) -> str:
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    return await run_in_threadpool(pwd_context.hash, password)

async def verify_password(plain_password: str, hashed_password: str) -> bool:
    return await run_in_threadpool(pwd_context.verify, plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    jti = str(uuid4())  
    to_encode.update({"exp": expire, "jti": jti})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from e


def _hash_refresh_token(token: str) -> str:
    return hmac.new(settings.SECRET_KEY.encode(), token.encode(), hashlib.sha256).hexdigest()

async def create_refresh_token(user_id: str) -> str:
    token = secrets.token_urlsafe(48)
    token_hash = _hash_refresh_token(token)
    now = datetime.utcnow()
    expires_at = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    await db.refresh_tokens.insert_one({
        "token_hash": token_hash,
        "user_id": ObjectId(user_id),
        "created_at": now,
        "expires_at": expires_at,
        "revoked": False
    })
    return token

async def verify_refresh_token(token: str) -> Optional[dict]:
    token_hash = _hash_refresh_token(token)
    doc = await db.refresh_tokens.find_one({"token_hash": token_hash})
    if not doc:
        return None
    if doc.get("revoked", False):
        return None
    expires_at = doc.get("expires_at")
    if expires_at and expires_at < datetime.utcnow():
        return None
    return doc

async def revoke_refresh_token(token: str) -> None:
    token_hash = _hash_refresh_token(token)
    await db.refresh_tokens.update_one({"token_hash": token_hash}, {"$set": {"revoked": True}})

async def revoke_all_refresh_tokens_for_user(user_id: str) -> None:
    await db.refresh_tokens.update_many({"user_id": ObjectId(user_id)}, {"$set": {"revoked": True}})

async def revoke_access_token(jti: str, user_id: str):
    await db.revoked_tokens.insert_one({
        "jti": jti,
        "user_id": user_id,
        "revoked_at": datetime.utcnow()
    })

async def revoke_all_access_tokens_for_user(user_id: str):
    await db.revoked_tokens.insert_one({
        "user_id": user_id,
        "revoke_all": True,
        "revoked_at": datetime.utcnow()
    })

async def is_access_token_revoked(payload: dict) -> bool:
    jti = payload.get("jti")
    user_id = payload.get("sub")
    if not jti or not user_id:
        return True

    if await db.revoked_tokens.find_one({"jti": jti}):
        return True
    if await db.revoked_tokens.find_one({"user_id": user_id, "revoke_all": True}):
        return True
    return False