# 📧 Guía de Configuración de Resend para Fixia

## 🎯 Objetivo
Configurar Resend para enviar emails desde `no-reply@send.fixia.app`

---

## PASO 1: Configurar Dominio en Resend

### 1.1 Accede a Resend Dashboard
- Ve a: https://resend.com/domains
- Click en **"Add Domain"**

### 1.2 Agrega el Subdominio
- **Dominio:** `send.fixia.app`
- Click en **"Add"**

### 1.3 Resend te mostrará 3 registros DNS que necesitas agregar:

**Ejemplo de registros (los tuyos serán diferentes):**
```
1. SPF Record (TXT)
   Name: send.fixia.app
   Value: v=spf1 include:_spf.resend.com ~all

2. DKIM Record (TXT)
   Name: resend._domainkey.send.fixia.app
   Value: [un string largo que Resend te proporcionará]

3. DMARC Record (TXT)
   Name: _dmarc.send.fixia.app
   Value: v=DMARC1; p=none;
```

---

## PASO 2: Agregar Registros DNS en Vercel

### 2.1 Ve a Vercel Dashboard
- URL: https://vercel.com/zillah777s-projects/fixia-pwa/settings/domains
- O ve a tu proyecto → Settings → Domains
- Click en el dominio `fixia.app`

### 2.2 Agrega los 3 Registros DNS

**Para cada registro que Resend te mostró:**

#### Registro SPF:
- Click en **"Add"** en la sección DNS Records
- **Type:** TXT
- **Name:** send
- **Value:** `v=spf1 include:_spf.resend.com ~all`
- **TTL:** 60
- Click **"Save"**

#### Registro DKIM:
- Click en **"Add"**
- **Type:** TXT
- **Name:** `resend._domainkey.send`
- **Value:** [Copia el valor que Resend te dio]
- **TTL:** 60
- Click **"Save"**

#### Registro DMARC:
- Click en **"Add"**
- **Type:** TXT
- **Name:** `_dmarc.send`
- **Value:** `v=DMARC1; p=none;`
- **TTL:** 60
- Click **"Save"**

---

## PASO 3: Verificar Dominio en Resend

### 3.1 Espera la Propagación DNS
- Normalmente toma 5-15 minutos
- Puede tomar hasta 48 horas en casos raros

### 3.2 Verifica en Resend
- Regresa a https://resend.com/domains
- Click en **"Verify"** junto a `send.fixia.app`
- Si todos los registros están correctos, verás ✅ verificado

---

## PASO 4: Verificar Variables en Render

Asegúrate de que tienes esta variable en Render:

```bash
EMAIL_FROM=Fixia <no-reply@send.fixia.app>
```

### Cómo verificar:
1. Ve a: https://dashboard.render.com/web/srv-d4kvofv5r7bs73clpih0
2. Click en "Environment"
3. Busca `EMAIL_FROM`
4. Si no existe, agrégala

---

## PASO 5: Probar el Envío de Emails

Después de que el dominio esté verificado:

1. **Redeploya tu aplicación en Render** (si ya agregaste las variables)
2. **Registra un nuevo usuario** en https://fixia.app
3. **Verifica que llegue el email de verificación**

### Troubleshooting:
- Si no llega el email, revisa los logs de Resend: https://resend.com/emails
- Verifica que el dominio esté verificado (✅)
- Revisa los logs de Render para ver errores

---

## ✅ Checklist Final

- [ ] Dominio agregado en Resend
- [ ] 3 registros DNS agregados en Vercel
- [ ] Dominio verificado en Resend (✅)
- [ ] Variable EMAIL_FROM configurada en Render
- [ ] Email de prueba enviado exitosamente

---

## 📞 Soporte

- **Resend Docs:** https://resend.com/docs
- **Verificar DNS:** https://mxtoolbox.com/SuperTool.aspx
- **Resend Status:** https://resend.com/status

---

## 🔄 Alternativa Temporal (mientras configuras)

Si quieres probar emails inmediatamente sin configurar el dominio:

1. Deja `EMAIL_FROM` sin configurar en Render
2. El sistema usará `onboarding@resend.dev` por defecto
3. **Límite:** 100 emails/día
4. Los emails pueden ir a spam

**Recomendación:** Configura el dominio personalizado para producción.
