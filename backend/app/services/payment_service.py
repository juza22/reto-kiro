import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.payment import Payment, PaymentStatus
from app.models.loan_request import LoanRequest, RequestStatus
from app.schemas.payment import PaymentSimulate


def get_payments_for_loan(db: Session, loan_request_id: int, borrower_id: int):
    loan = db.query(LoanRequest).filter(LoanRequest.id == loan_request_id).first()
    if not loan or loan.borrower_id != borrower_id:
        raise HTTPException(status_code=403, detail="No tienes acceso a este préstamo.")
    return db.query(Payment).filter(Payment.loan_request_id == loan_request_id).order_by(Payment.installment_number).all()


def simulate_payment(db: Session, payment_id: int, data: PaymentSimulate, borrower_id: int) -> Payment:
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Cuota no encontrada.")

    loan = db.query(LoanRequest).filter(LoanRequest.id == payment.loan_request_id).first()
    if loan.borrower_id != borrower_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para pagar esta cuota.")

    if payment.status == PaymentStatus.CONFIRMED:
        raise HTTPException(status_code=400, detail="Esta cuota ya fue pagada.")

    # Simulación de pago Nequi / PSE
    ref = f"SIM-{data.payment_method.upper()}-{uuid.uuid4().hex[:8].upper()}"

    payment.status = PaymentStatus.SIMULATED
    payment.amount_paid = payment.amount_due
    payment.paid_at = datetime.utcnow()
    payment.payment_method = data.payment_method
    payment.transaction_reference = ref

    # Verificar si todas las cuotas están pagadas
    all_payments = db.query(Payment).filter(Payment.loan_request_id == loan.id).all()
    if all(p.status in [PaymentStatus.SIMULATED, PaymentStatus.CONFIRMED] for p in all_payments):
        loan.status = RequestStatus.PAID

    db.commit()
    db.refresh(payment)
    return payment
