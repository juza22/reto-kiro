from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.payment import PaymentSimulate, PaymentOut
from app.services.payment_service import get_payments_for_loan, simulate_payment

router = APIRouter(prefix="/payments", tags=["Pagos"])


@router.get("/{loan_request_id}", response_model=List[PaymentOut], summary="Ver cuotas de un préstamo")
def list_payments(
    loan_request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_payments_for_loan(db, loan_request_id, current_user.id)


@router.post("/{payment_id}/pay", response_model=PaymentOut, summary="Simular pago de cuota (Nequi/PSE)")
def pay(
    payment_id: int,
    data: PaymentSimulate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return simulate_payment(db, payment_id, data, current_user.id)
