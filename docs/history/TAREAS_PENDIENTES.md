# 📋 FIXIA - TAREAS PENDIENTES

**Estado:** Revisión completada, implementación en progreso

---

## 🔴 CRÍTICO (Antes de Producción)

### 1. User Enumeration Fix (5 min) ⏳
- **Archivo:** `src/app/api/auth/register/route.ts` (líneas 77-85)
- **Problema:** Mensajes de error revelan qué email/teléfono ya existe
- **Fix:** Mensaje genérico "Usuario ya existe"
- **Status:** ❌ NO HECHO
- **Estimado:** 5 minutos

### 2. Password Reset Rate Limiting (30 min) ⏳
- **Archivo:** `src/app/api/auth/forgot-password/route.ts`
- **Problema:** Sin protección contra brute force
- **Fix:** Max 3 intentos por email/hora
- **Status:** ❌ NO HECHO
- **Estimado:** 30 minutos

### 3. Admin Users Pagination (15 min) ⏳
- **Archivo:** `src/app/api/admin/users/route.ts`
- **Problema:** Carga todos los usuarios sin límite
- **Fix:** Agregar `?page=1&limit=50`
- **Status:** ❌ NO HECHO
- **Estimado:** 15 minutos

### 4. Marketplace Requests Pagination (15 min) ⏳
- **Archivo:** `src/app/api/requests/route.ts`
- **Problema:** Cargar todos los requests sin límite
- **Fix:** Paginar con default limit 20
- **Status:** ❌ NO HECHO
- **Estimado:** 15 minutos

### 5. Configuración de Secretos ⏳
- [ ] `MERCADOPAGO_WEBHOOK_SECRET` - obtener del dashboard
- [ ] Database password - cambiar de "password"
- [ ] JWT_SECRET - generar random (32+ chars)
- [ ] RESEND_API_KEY - configurar si no está
- [ ] CLOUDINARY_API_KEY - configurar si no está
- **Status:** ❌ NO HECHO
- **Estimado:** 20 minutos

---

## 🟠 ALTO (Próxima Semana)

### 6. Chat WebSocket (6 horas) 🎯
- **Archivo:** `src/app/dashboard/matches/page.tsx` (líneas 35-47)
- **Problema:** Polling cada 5 segundos (12 req/min)
- **Fix:** Implementar WebSocket o SSE
- **Status:** ❌ NO HECHO
- **Estimado:** 6 horas
- **Impacto:** Rendimiento crítico

### 7. Validación en 4+ Endpoints (2 horas) 🎯
- **Messages:** No text length validation
- **Services:** No price bounds validation
- **Portfolio:** No field length validation
- **Favorites:** No validation
- **Status:** ❌ NO HECHO
- **Estimado:** 2 horas

### 8. Soft Delete Filtering (1 hora) 🎯
- **Archivo:** Todas las queries con `User`
- **Problema:** Usuarios borrados aún aparecen
- **Fix:** Agregar `where: { deletedAt: null }`
- **Status:** ❌ NO HECHO
- **Estimado:** 1 hora

### 9. Setup de Monitoring (4 horas) 🎯
- **Herramienta:** Sentry o LogRocket
- **Setup:** Error tracking + performance monitoring
- **Status:** ❌ NO HECHO
- **Estimado:** 4 horas

---

## 🟡 MEDIO (Próximas 2 Semanas)

### 10. E2E Tests (4 horas)
- **Framework:** Playwright
- **Coverage:** Auth, Dashboard, Marketplace
- **Status:** ❌ NO HECHO
- **Estimado:** 4 horas

### 11. Load Testing (3 horas)
- **Tool:** K6 o Artillery
- **Target:** 100+ concurrent users
- **Status:** ❌ NO HECHO
- **Estimado:** 3 horas

### 12. Backup Automation (2 horas)
- **Setup:** Cron job para backups diarios
- **Retention:** 30 días de backups
- **Status:** ❌ NO HECHO
- **Estimado:** 2 horas

### 13. Refresh Token Strategy (4 horas)
- **Problema:** JWT expiration 15 min requiere refresh
- **Fix:** Implementar refresh token flow
- **Status:** ❌ NO HECHO
- **Estimado:** 4 horas

### 14. Database Constraints (2 horas)
- **Constraint:** Review.score BETWEEN 1 AND 5
- **Constraint:** Service.price > 0
- **Fix:** Agregar check constraints en Prisma
- **Status:** ❌ NO HECHO
- **Estimado:** 2 horas

---

## 📊 RESUMEN

| Categoría | Cantidad | Tiempo | Status |
|-----------|----------|--------|--------|
| **Crítico** | 5 | 1.5h | ❌ 0% |
| **Alto** | 3 | 9h | ❌ 0% |
| **Medio** | 6 | 15h | ❌ 0% |
| **TOTAL** | 14 | 25.5h | ❌ 0% |

---

## 🎯 PRIORIDAD RECOMENDADA

### HOY/MAÑANA (Crítico - 1.5 horas)
```
1. User enumeration fix (5 min)
2. Password reset rate limiting (30 min)
3. Admin pagination (15 min)
4. Marketplace pagination (15 min)
5. Configurar secretos (20 min)
```

### ESTA SEMANA (Alto - 9 horas)
```
6. Chat WebSocket (6h)
7. Validación endpoints (2h)
8. Soft delete filtering (1h)
```

### PRÓXIMAS 2 SEMANAS (Medio - 15 horas)
```
9. Monitoring setup (4h)
10. E2E tests (4h)
11. Load testing (3h)
12. Backup automation (2h)
13. Refresh token (4h)
14. Database constraints (2h)
```

---

## 💡 RECOMENDACIÓN

**Para producción segura:** Completar al menos los 5 items CRÍTICOS (1.5 horas)

**Para producción sólida:** + 3 items ALTO (9 horas más)

**Para producción robusta:** + 6 items MEDIO (15 horas más)

---

## ✅ CHECKLIST RÁPIDO

- [ ] User enumeration fix
- [ ] Rate limiting password reset
- [ ] Admin pagination
- [ ] Marketplace pagination
- [ ] Secrets configurados
- [ ] WebSocket chat
- [ ] Tests E2E
- [ ] Monitoring
- [ ] Backups automatizados
- [ ] Documentación actualizada

