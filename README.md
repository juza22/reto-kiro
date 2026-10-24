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

### Opción 1 — Local (sin Docker, usa SQLite)

Requisitos: **Python 3.11** y **Node.js LTS** instalados.

En una terminal (backend):
```powershell
.\start-backend.ps1
```

En otra terminal (frontend):
```powershell
.\start-frontend.ps1
```

- API: http://localhost:8000 · Docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

### Opción 2 — Docker (usa PostgreSQL)

```bash
docker-compose up --build
```

## Usuarios de demo (contraseña: `demo1234`)

El script `seed.py` crea el escenario de ejemplo automáticamente:

| Rol | Correo | Detalle |
|-----|--------|---------|
| Prestamista | julian@demo.com | Oferta: $1.000.000 al 3%/mes a 3 meses |
| Prestatario | andres@demo.com | Debe $3.000/mes + capital |
| Prestatario | laura@demo.com | Debe $27.000/mes + capital |

## Flujo de ejemplo

1. Julián se registra y publica oferta: $1.000.000 al 3%/mes a 3 meses
2. Andrés se registra y solicita $100.000
3. Laura se registra y solicita $900.000
4. Julián aprueba ambas solicitudes
5. Andrés paga $3.000/mes (+ capital en última cuota)
6. Laura paga $27.000/mes (+ capital en última cuota)
