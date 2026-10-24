"""
Script de datos de ejemplo (seed) para el demo.
Crea el escenario: Julian presta 1.000.000 al 3%/mes a 3 meses,
Andres solicita 100.000 y Laura solicita 900.000.

Uso:  python seed.py
"""
from app.db.base import Base, engine, SessionLocal
from app.models.user import User
from app.models.loan_offer import LoanOffer, OfferStatus
from app.models.loan_request import LoanRequest, RequestStatus
from app.core.security import get_password_hash
from app.services.loan_request_service import approve_loan_request

# Asegurar tablas creadas
Base.metadata.create_all(bind=engine)

db = SessionLocal()


def get_or_create_user(full_name, email, phone, password):
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        hashed_password=get_password_hash(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def main():
    print("Creando usuarios de ejemplo...")
    julian = get_or_create_user("Julian", "julian@demo.com", "3001112233", "demo1234")
    andres = get_or_create_user("Andres", "andres@demo.com", "3002223344", "demo1234")
    laura = get_or_create_user("Laura", "laura@demo.com", "3003334455", "demo1234")

    # Evitar duplicar la oferta si ya existe
    existing = db.query(LoanOffer).filter(LoanOffer.lender_id == julian.id).first()
    if existing:
        print("La oferta de ejemplo ya existe. Nada que hacer.")
        return

    print("Creando oferta de Julian: $1.000.000 al 3%/mes a 3 meses...")
    offer = LoanOffer(
        lender_id=julian.id,
        total_amount=1_000_000,
        available_amount=1_000_000,
        interest_rate=0.03,
        term_months=3,
        description="Prestamo gota a gota bancarizado - demo",
        status=OfferStatus.OPEN,
    )
    db.add(offer)
    db.commit()
    db.refresh(offer)

    print("Andres solicita $100.000...")
    req_andres = LoanRequest(
        offer_id=offer.id,
        borrower_id=andres.id,
        amount=100_000,
        payment_method="nequi",
        payment_reference="3002223344",
        status=RequestStatus.PENDING,
    )
    db.add(req_andres)
    offer.available_amount -= 100_000
    offer.status = OfferStatus.PARTIAL

    print("Laura solicita $900.000...")
    req_laura = LoanRequest(
        offer_id=offer.id,
        borrower_id=laura.id,
        amount=900_000,
        payment_method="pse",
        payment_reference="REF-LAURA-001",
        status=RequestStatus.PENDING,
    )
    db.add(req_laura)
    offer.available_amount -= 900_000
    offer.status = OfferStatus.FUNDED
    db.commit()
    db.refresh(req_andres)
    db.refresh(req_laura)

    print("Julian aprueba ambas solicitudes (se generan las cuotas)...")
    approve_loan_request(db, req_andres.id, julian.id)
    approve_loan_request(db, req_laura.id, julian.id)

    print("\n=== Datos de acceso (contrasena: demo1234) ===")
    print("Prestamista:  julian@demo.com")
    print("Prestatario:  andres@demo.com  (debe $3.000/mes + capital)")
    print("Prestatario:  laura@demo.com   (debe $27.000/mes + capital)")
    print("\nSeed completado.")


if __name__ == "__main__":
    main()
    db.close()
