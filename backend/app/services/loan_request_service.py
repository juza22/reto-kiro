from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.loan_offer import LoanOffer, OfferStatus
from app.models.loan_request import LoanRequest, RequestStatus
from app.models.payment import Payment, PaymentStatus
from app.schemas.loan_request import LoanRequestCreate


def create_loan_request(db: Session, data: LoanRequestCreate, borrower_id: int) -> LoanRequest:
    offer = db.query(LoanOffer).filter(LoanOffer.id == data.offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta no encontrada.")

    if offer.status not in [OfferStatus.OPEN, OfferStatus.PARTIAL]:
        raise HTTPException(status_code=400, detail="Esta oferta no está disponible.")

    if data.amount > offer.available_amount:
        raise HTTPException(
            status_code=400,
            detail=f"El monto solicitado supera el disponible (${offer.available_amount:,.0f} COP)."
        )

    if offer.lender_id == borrower_id:
        raise HTTPException(status_code=400, detail="No puedes solicitar tu propio préstamo.")

    loan_request = LoanRequest(
        offer_id=data.offer_id,
        borrower_id=borrower_id,
        amount=data.amount,
        payment_method=data.payment_method,
        payment_reference=data.payment_reference,
        status=RequestStatus.PENDING,
    )
    db.add(loan_request)
    db.flush()

    # Actualizar monto disponible en la oferta
    offer.available_amount -= data.amount
    if offer.available_amount <= 0:
        offer.status = OfferStatus.FUNDED
    else:
        offer.status = OfferStatus.PARTIAL

    db.commit()
    db.refresh(loan_request)
    return loan_request


def approve_loan_request(db: Session, request_id: int, lender_id: int) -> LoanRequest:
    loan_request = db.query(LoanRequest).filter(LoanRequest.id == request_id).first()
    if not loan_request:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada.")

    offer = db.query(LoanOffer).filter(LoanOffer.id == loan_request.offer_id).first()
    if offer.lender_id != lender_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para aprobar esta solicitud.")

    if loan_request.status != RequestStatus.PENDING:
        raise HTTPException(status_code=400, detail="Esta solicitud ya fue procesada.")

    loan_request.status = RequestStatus.ACTIVE
    loan_request.approved_at = datetime.utcnow()

    # Generar cuotas de pago
    for i in range(1, offer.term_months + 1):
        amount_due = round(loan_request.amount * offer.interest_rate, 2)
        # En la última cuota se devuelve también el capital
        if i == offer.term_months:
            amount_due += loan_request.amount

        payment = Payment(
            loan_request_id=loan_request.id,
            installment_number=i,
            amount_due=amount_due,
            due_date=datetime.utcnow() + timedelta(days=30 * i),
            status=PaymentStatus.PENDING,
        )
        db.add(payment)

    db.commit()
    db.refresh(loan_request)
    return loan_request


def get_my_requests(db: Session, borrower_id: int):
    return db.query(LoanRequest).filter(LoanRequest.borrower_id == borrower_id).all()


def get_requests_for_offer(db: Session, offer_id: int, lender_id: int):
    offer = db.query(LoanOffer).filter(LoanOffer.id == offer_id).first()
    if not offer or offer.lender_id != lender_id:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta oferta.")
    return db.query(LoanRequest).filter(LoanRequest.offer_id == offer_id).all()
