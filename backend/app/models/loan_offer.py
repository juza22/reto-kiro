from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class OfferStatus(str, enum.Enum):
    OPEN = "open"           # Disponible para solicitudes
    PARTIAL = "partial"     # Parcialmente cubierto
    FUNDED = "funded"       # 100% cubierto
    CLOSED = "closed"       # Cerrado por el prestamista


class LoanOffer(Base):
    __tablename__ = "loan_offers"

    id = Column(Integer, primary_key=True, index=True)
    lender_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    total_amount = Column(Float, nullable=False)        # Monto total ofertado
    available_amount = Column(Float, nullable=False)    # Monto aún disponible
    interest_rate = Column(Float, nullable=False)       # Tasa mensual, ej: 0.03 = 3%
    term_months = Column(Integer, nullable=False)       # Plazo en meses
    description = Column(String, nullable=True)
    status = Column(Enum(OfferStatus), default=OfferStatus.OPEN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lender = relationship("User", foreign_keys=[lender_id])
    loan_requests = relationship("LoanRequest", back_populates="offer")
