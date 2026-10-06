from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=200)
    location: Optional[str] = Field(None, max_length=100)
    target_role: Optional[str] = Field(None, max_length=200)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    location: Optional[str]
    target_role: Optional[str]
    is_email_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
