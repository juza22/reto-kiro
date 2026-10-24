from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class RequestStatus(str, enum.Enum):
    PENDING = "pending"       # Solicitado, esperando aprobación
    APPROVED = "approved"     # Aprobado, dinero entregado
    REJECTED = "rejected"     # Rechazado
    ACTIVE = "active"         # En curso, pagando cuotas
    PAID = "paid"             # Pagado completamente


class LoanRequest(Base):
    __tablename__ = "loan_requests"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(Integer, ForeignKey("loan_offers.id"), nullable=False)
    borrower_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    amount = Column(Float, nullable=False)              # Monto solicitado
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    payment_method = Column(String, nullable=True)      # "nequi" | "pse"
    payment_reference = Column(String, nullable=True)   # Número Nequi / PSE
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)

    offer = relationship("LoanOffer", back_populates="loan_requests")
    borrower = relationship("User", foreign_keys=[borrower_id])
    payments = relationship("Payment", back_populates="loan_request")
