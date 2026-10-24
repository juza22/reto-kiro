from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.loan_offer import LoanOffer, OfferStatus
from app.models.loan_request import LoanRequest, RequestStatus
from app.models.payment import Payment, PaymentStatus

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/lender", summary="Dashboard del prestamista")
def lender_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    offers = db.query(LoanOffer).filter(LoanOffer.lender_id == current_user.id).all()
    offer_ids = [o.id for o in offers]

    active_loans = db.query(LoanRequest).filter(
        LoanRequest.offer_id.in_(offer_ids),
        LoanRequest.status == RequestStatus.ACTIVE
    ).all() if offer_ids else []

    total_lent = sum(r.amount for r in active_loans)
    pending_payments = db.query(Payment).join(LoanRequest).filter(
        LoanRequest.offer_id.in_(offer_ids),
        Payment.status == PaymentStatus.PENDING
    ).all() if offer_ids else []

    return {
        "total_offers": len(offers),
        "active_loans_count": len(active_loans),
        "total_lent_cop": total_lent,
        "pending_installments": len(pending_payments),
        "expected_return_cop": sum(p.amount_due for p in pending_payments),
    }


@router.get("/borrower", summary="Dashboard del prestatario")
def borrower_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    loans = db.query(LoanRequest).filter(
        LoanRequest.borrower_id == current_user.id,
        LoanRequest.status.in_([RequestStatus.ACTIVE, RequestStatus.PAID])
    ).all()

    loan_ids = [l.id for l in loans]
    pending_payments = db.query(Payment).filter(
        Payment.loan_request_id.in_(loan_ids),
        Payment.status == PaymentStatus.PENDING
    ).all() if loan_ids else []

    return {
        "active_loans": len([l for l in loans if l.status == RequestStatus.ACTIVE]),
        "paid_loans": len([l for l in loans if l.status == RequestStatus.PAID]),
        "pending_installments": len(pending_payments),
        "total_debt_cop": sum(p.amount_due for p in pending_payments),
    }
