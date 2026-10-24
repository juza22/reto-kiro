# 📊 Demo — GotaAGota Bank

## Presentación (estilo PPT)

Abre **`presentacion.html`** en cualquier navegador. Es una presentación autocontenida (no requiere internet ni dependencias).

- **← / →** o **barra espaciadora**: navegar entre diapositivas
- **F11**: pantalla completa (modo proyección)
- Para exportar a PDF: `Ctrl+P` → Guardar como PDF (orientación horizontal)

### Contenido (8 diapositivas)
1. Portada
2. El problema y la solución
3. Cómo funciona (flujo de 5 pasos)
4. Ejemplo numérico real (Julián, Andrés, Laura)
5. Stack tecnológico
6. Capturas de la aplicación
7. **Qué se usó de Kiro**
8. Cierre

## Escenario de demo cargado (seed.py)

| Rol | Usuario | Contraseña | Detalle |
|-----|---------|-----------|---------|
| Prestamista | julian@demo.com | demo1234 | Oferta de $1.000.000 al 3%/mes a 3 meses |
| Prestatario | andres@demo.com | demo1234 | $100.000 → paga $3.000/mes + capital |
| Prestatario | laura@demo.com | demo1234 | $900.000 → paga $27.000/mes + capital |

## Verificación del backend (ya probado ✓)

El flujo completo fue validado de extremo a extremo:
- Login con JWT ✓
- Oferta colocada 100% (estado `funded`) ✓
- Cuotas generadas correctamente: Andrés `[3.000, 3.000, 103.000]` ✓
- Pago simulado genera referencia `SIM-NEQUI-xxxx` ✓
- Dashboard del prestamista: retorno esperado $1.090.000 ✓
