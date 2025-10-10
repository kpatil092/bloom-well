from fastapi import APIRouter, HTTPException, Depends, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from bson import ObjectId
from datetime import timedelta
from app.schemas.user import UserCreate, UserLogin, UserOut, TokenResponse
from app.utils.db import db
from app.utils import auth_utils
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = HTTPBearer()

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    from jose import JWTError
    try:
        payload = auth_utils.decode_access_token(token.credentials)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        if await auth_utils.is_access_token_revoked(payload):
            raise HTTPException(status_code=401, detail="Token has been revoked")

    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    return user_doc, payload

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Password and confirm_password do not match")

    existing = await db.users.find_one({"$or": [{"email": user.email}, {"username": user.username}]})
    if existing:
        if existing.get("email") == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
        if existing.get("username") == user.username:
            raise HTTPException(status_code=400, detail="Username already taken")
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = await auth_utils.hash_password(user.password)
    user_doc = {"username": user.username, "email": user.email, "hashed_password": hashed_pw, "created_at": None}
    result = await db.users.insert_one(user_doc)
    return {"id": str(result.inserted_id), "username": user.username, "email": user.email}

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    search_value = payload.email or payload.username
    if not search_value:
        raise HTTPException(status_code=400, detail="Must provide username or email")
    query = {"$or": [{"email": search_value}, {"username": search_value}]}

    user_doc = await db.users.find_one(query)
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not await auth_utils.verify_password(payload.password, user_doc["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id = str(user_doc["_id"])
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        {"sub": user_id, "username": user_doc["username"]},
        expires_delta=access_token_expires
    )
    refresh_token = await auth_utils.create_refresh_token(user_id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_token: str = Body(..., embed=True)):
    token_doc = await auth_utils.verify_refresh_token(refresh_token)
    if not token_doc:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    await auth_utils.revoke_refresh_token(refresh_token)
    user_id = str(token_doc["user_id"])

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token({"sub": user_id}, expires_delta=access_token_expires)
    new_refresh_token = await auth_utils.create_refresh_token(user_id)

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }



@router.post("/logout")
async def logout(
    refresh_token: str = Body(..., embed=True),
    token_data: tuple = Depends(get_current_user)
):
    current_user, payload = token_data

    token_doc = await auth_utils.verify_refresh_token(refresh_token)
    if not token_doc or str(token_doc["user_id"]) != str(current_user["_id"]):
        raise HTTPException(status_code=401, detail="Invalid or unauthorized refresh token")

    await auth_utils.revoke_refresh_token(refresh_token)
    await auth_utils.revoke_access_token(payload["jti"], str(current_user["_id"]))

    return JSONResponse({"message": "Logged out: both refresh and access tokens revoked"})



@router.post("/logout_all")
async def logout_all(token_data: tuple = Depends(get_current_user)):
    current_user, _ = token_data
    user_id = str(current_user["_id"])
    await auth_utils.revoke_all_refresh_tokens_for_user(user_id)
    await auth_utils.revoke_all_access_tokens_for_user(user_id)
    return JSONResponse({"message": "All sessions revoked (refresh + access)"})

@router.get("/me", response_model=UserOut)
async def me(token_data: tuple = Depends(get_current_user)):
    current_user, _ = token_data
    return {"id": str(current_user["_id"]), "username": current_user["username"], "email": current_user["email"]}