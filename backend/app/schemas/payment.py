from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.payment import PaymentStatus


class PaymentSimulate(BaseModel):
    payment_method: str   # "nequi" | "pse"
    transaction_reference: str


class PaymentOut(BaseModel):
    id: int
    loan_request_id: int
    installment_number: int
    amount_due: float
    amount_paid: Optional[float]
    due_date: datetime
    paid_at: Optional[datetime]
    payment_method: Optional[str]
    transaction_reference: Optional[str]
    status: PaymentStatus

    class Config:
        from_attributes = True
