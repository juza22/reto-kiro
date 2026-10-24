from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.loan_offer import LoanOfferCreate, LoanOfferOut
from app.services.loan_offer_service import create_offer, get_open_offers, get_offer_by_id, get_my_offers

router = APIRouter(prefix="/offers", tags=["Ofertas de Préstamo"])


@router.post("/", response_model=LoanOfferOut, summary="Publicar oferta de préstamo")
def publish_offer(
    data: LoanOfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offer = create_offer(db, data, current_user.id)
    return _to_out(offer)


@router.get("/", response_model=List[LoanOfferOut], summary="Listar ofertas disponibles")
def list_offers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    offers = get_open_offers(db)
    return [_to_out(o) for o in offers]


@router.get("/mine", response_model=List[LoanOfferOut], summary="Mis ofertas publicadas")
def my_offers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    offers = get_my_offers(db, current_user.id)
    return [_to_out(o) for o in offers]


@router.get("/{offer_id}", response_model=LoanOfferOut, summary="Detalle de oferta")
def offer_detail(offer_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    offer = get_offer_by_id(db, offer_id)
    return _to_out(offer)


def _to_out(offer) -> LoanOfferOut:
    return LoanOfferOut(
        id=offer.id,
        lender_id=offer.lender_id,
        lender_name=offer.lender.full_name,
        total_amount=offer.total_amount,
        available_amount=offer.available_amount,
        interest_rate=offer.interest_rate,
        term_months=offer.term_months,
        description=offer.description,
        status=offer.status,
        created_at=offer.created_at,
    )
