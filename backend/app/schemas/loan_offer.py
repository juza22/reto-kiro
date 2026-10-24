from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.loan_offer import OfferStatus


class LoanOfferCreate(BaseModel):
    total_amount: float = Field(..., gt=0, description="Monto total a prestar en COP")
    interest_rate: float = Field(..., gt=0, le=1, description="Tasa mensual, ej: 0.03 para 3%")
    term_months: int = Field(..., gt=0, le=24, description="Plazo en meses")
    description: Optional[str] = None


class LoanOfferOut(BaseModel):
    id: int
    lender_id: int
    lender_name: str
    total_amount: float
    available_amount: float
    interest_rate: float
    term_months: int
    description: Optional[str]
    status: OfferStatus
    created_at: datetime

    class Config:
        from_attributes = True
