from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.loan_offer import LoanOffer, OfferStatus
from app.schemas.loan_offer import LoanOfferCreate


def create_offer(db: Session, data: LoanOfferCreate, lender_id: int) -> LoanOffer:
    offer = LoanOffer(
        lender_id=lender_id,
        total_amount=data.total_amount,
        available_amount=data.total_amount,
        interest_rate=data.interest_rate,
        term_months=data.term_months,
        description=data.description,
    )
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


def get_open_offers(db: Session):
    return db.query(LoanOffer).filter(
        LoanOffer.status.in_([OfferStatus.OPEN, OfferStatus.PARTIAL])
    ).all()


def get_offer_by_id(db: Session, offer_id: int) -> LoanOffer:
    offer = db.query(LoanOffer).filter(LoanOffer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta no encontrada.")
    return offer


def get_my_offers(db: Session, lender_id: int):
    return db.query(LoanOffer).filter(LoanOffer.lender_id == lender_id).all()
