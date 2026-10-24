from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base, engine
from app.api.routes import auth, offers, loans, payments, dashboard

# Crear tablas al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GotaAGota Bank API",
    description="Plataforma de microcréditos P2P - Bancarizando los gota a gota",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(offers.router, prefix="/api")
app.include_router(loans.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


@app.get("/", tags=["Health"])
def root():
    return {"message": "GotaAGota Bank API funcionando 🚀", "docs": "/docs"}
