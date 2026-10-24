from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.loan_request import LoanRequestCreate, LoanRequestOut
from app.services.loan_request_service import (
    create_loan_request,
    approve_loan_request,
    get_my_requests,
    get_requests_for_offer,
)

router = APIRouter(prefix="/loans", tags=["Solicitudes de Préstamo"])


@router.post("/", response_model=LoanRequestOut, summary="Solicitar un préstamo")
def request_loan(
    data: LoanRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = create_loan_request(db, data, current_user.id)
    return _to_out(req)


@router.post("/{request_id}/approve", response_model=LoanRequestOut, summary="Aprobar solicitud de préstamo")
def approve(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = approve_loan_request(db, request_id, current_user.id)
    return _to_out(req)


@router.get("/mine", response_model=List[LoanRequestOut], summary="Mis solicitudes de préstamo")
def my_loans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reqs = get_my_requests(db, current_user.id)
    return [_to_out(r) for r in reqs]


@router.get("/offer/{offer_id}", response_model=List[LoanRequestOut], summary="Solicitudes por oferta")
def loans_for_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reqs = get_requests_for_offer(db, offer_id, current_user.id)
    return [_to_out(r) for r in reqs]


def _to_out(req) -> LoanRequestOut:
    return LoanRequestOut(
        id=req.id,
        offer_id=req.offer_id,
        borrower_id=req.borrower_id,
        borrower_name=req.borrower.full_name,
        amount=req.amount,
        status=req.status,
        payment_method=req.payment_method,
        payment_reference=req.payment_reference,
        created_at=req.created_at,
        approved_at=req.approved_at,
    )
