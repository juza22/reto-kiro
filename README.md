# 💧 GotaAGota Bank

Plataforma de microcréditos P2P (Peer-to-Peer Lending) que bancariza el modelo "gota a gota".

## ¿Qué hace?

- Cualquier usuario puede **publicar una oferta de préstamo** (monto, tasa, plazo)
- Otros usuarios pueden **solicitar una porción** del dinero disponible
- El prestamista **aprueba** las solicitudes
- Los prestatarios **pagan cuotas mensuales** (simulado vía Nequi/PSE)
- Dashboard para prestamistas y prestatarios

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Python + FastAPI |
| Base de datos | PostgreSQL + SQLAlchemy |
| Frontend Web | React + Tailwind CSS |
| Auth | JWT |
| Pagos | Simulado (Nequi/PSE mock) |
| Infra | Docker + Docker Compose |

## Correr localmente

```bash
docker-compose up --build
```

- API: http://localhost:8000
- Docs API: http://localhost:8000/docs
- Frontend: http://localhost:3000

## Flujo de ejemplo

1. Julián se registra y publica oferta: $1.000.000 al 3%/mes a 3 meses
2. Andrés se registra y solicita $100.000
3. Laura se registra y solicita $900.000
4. Julián aprueba ambas solicitudes
5. Andrés paga $3.000/mes (+ capital en última cuota)
6. Laura paga $27.000/mes (+ capital en última cuota)
