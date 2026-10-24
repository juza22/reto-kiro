from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.loan_request import RequestStatus


class LoanRequestCreate(BaseModel):
    offer_id: int
    amount: float = Field(..., gt=0, description="Monto a solicitar en COP")
    payment_method: str = Field(..., pattern="^(nequi|pse)$")
    payment_reference: str = Field(..., description="Número de Nequi o referencia PSE")


class LoanRequestOut(BaseModel):
    id: int
    offer_id: int
    borrower_id: int
    borrower_name: str
    amount: float
    status: RequestStatus
    payment_method: Optional[str]
    payment_reference: Optional[str]
    created_at: datetime
    approved_at: Optional[datetime]

    class Config:
        from_attributes = True
