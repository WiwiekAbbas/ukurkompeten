from pydantic import BaseModel, Field
from typing import Optional


class PaymentRequest(BaseModel):
    package_id: int
    payment_method: str = Field(..., description="credit_card, bank_transfer, gopay, ovo, etc.")


class PaymentResponse(BaseModel):
    transaction_id: int
    amount: float
    payment_url: str
    expires_at: str
    instructions: str
