# GotaAGota Bank — Steering

## Descripción del proyecto
Plataforma P2P de microcréditos que bancariza el modelo "gota a gota" colombiano.

## Stack
- Backend: Python 3.11 + FastAPI + SQLAlchemy + PostgreSQL
- Frontend Web: React 18 + Tailwind CSS
- Auth: JWT (python-jose + passlib)
- Pagos: Simulado (Nequi/PSE mock — sin pasarela real en MVP)
- Infra: Docker + Docker Compose

## Estructura
```
reto-kiro/
  backend/app/
    api/routes/   → endpoints FastAPI
    core/         → config, seguridad JWT
    db/           → base, sesión SQLAlchemy
    models/       → tablas ORM (User, LoanOffer, LoanRequest, Payment)
    schemas/      → Pydantic schemas
    services/     → lógica de negocio
  frontend/src/
    pages/        → vistas React
    context/      → AuthContext
    services/     → llamadas API (axios)
  docker-compose.yml
```

## Reglas de negocio clave
- Un prestamista publica una oferta con monto total, tasa mensual y plazo
- Varios prestatarios pueden tomar porciones del monto disponible
- El prestamista aprueba cada solicitud manualmente
- Al aprobar se generan las cuotas automáticamente
- En cada cuota se paga solo el interés; en la última cuota interés + capital
- Los pagos son simulados (Nequi/PSE), sin integración real en MVP

## Convenciones
- Nombres en español para variables de negocio
- Endpoints REST bajo /api/
- Toda respuesta de error debe tener el campo `detail`
- Tasas de interés se almacenan como decimal (0.03 = 3%)
