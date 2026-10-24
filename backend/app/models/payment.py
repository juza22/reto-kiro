from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SIMULATED = "simulated"   # Pago simulado (Nequi/PSE mock)
    CONFIRMED = "confirmed"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    loan_request_id = Column(Integer, ForeignKey("loan_requests.id"), nullable=False)

    installment_number = Column(Integer, nullable=False)   # Cuota 1, 2, 3...
    amount_due = Column(Float, nullable=False)             # Monto a pagar
    amount_paid = Column(Float, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=False)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    payment_method = Column(String, nullable=True)        # "nequi" | "pse"
    transaction_reference = Column(String, nullable=True) # Referencia simulada
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)

    loan_request = relationship("LoanRequest", back_populates="payments")
