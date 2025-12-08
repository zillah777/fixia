# 🎨 Fixia Badge Components - Complete Guide

## Overview

Colección completa de badges y componentes hermosos para el marketplace de Fixia. Todos completamente responsivos, accesibles y con soporte para dark mode.

---

## 📦 Componentes Disponibles

### 1. Trust Badges (`trust-badges.tsx`)

Badges que demuestran confiabilidad y verificación del profesional.

**Variantes:**
- `verified` - Profesional verificado (Checkmark verde)
- `expert` - Experto certificado (Award oro)
- `fast` - Respuesta rápida (Lightning naranja)
- `secure` - Pago seguro (Lock teal)
- `favorite` - Favorito de usuarios (Heart rojo)
- `trending` - En tendencia (TrendingUp teal)

**Props:**
```typescript
interface TrustBadgeProps {
  variant: "verified" | "expert" | "fast" | "secure" | "favorite" | "trending"
  size: "sm" | "md" | "lg"  // Default: "md"
  showLabel: boolean         // Default: false
  className?: string
}
```

**Ejemplos de Uso:**

```tsx
// Simple badge
<TrustBadge variant="verified" />

// Con etiqueta
<TrustBadge variant="verified" size="md" showLabel />

// Múltiples badges
<TrustBadgesGroup
  badges={["verified", "expert", "fast"]}
  size="sm"
  showLabels={true}
/>
```

---

### 2. Premium Badges (`premium-badge.tsx`)

Indicadores de nivel premium para profesionales destacados.

**Tiers:**
- `gold` - Premium (Gradient ámbar)
- `platinum` - Platino (Gradient plata)
- `diamond` - Diamante (Gradient cian)

**Props:**
```typescript
interface PremiumBadgeProps {
  tier: "gold" | "platinum" | "diamond"  // Default: "gold"
  size: "sm" | "md" | "lg"               // Default: "md"
  animated: boolean                      // Default: true
  className?: string
}
```

**Ejemplo:**
```tsx
<PremiumBadge tier="diamond" size="lg" animated />
```

---

### 3. Status Badges (`status-badge.tsx`)

Muestra el estado actual de un servicio o solicitud.

**Estados:**
- `active` - Activo (Emerald)
- `pending` - Pendiente (Amber)
- `warning` - Atención (Orange)
- `error` - Error (Red)
- `paused` - Pausado (Gray)
- `launching` - Lanzando (Accent)

**Props:**
```typescript
interface StatusBadgeProps {
  status: "active" | "pending" | "warning" | "error" | "paused" | "launching"
  showLabel: boolean  // Default: true
  size: "sm" | "md" | "lg"  // Default: "md"
  animated: boolean  // Default: false
  className?: string
}
```

**Ejemplos:**
```tsx
// Solo icono
<StatusBadge status="active" showLabel={false} />

// Con etiqueta animada
<StatusBadge status="pending" animated />

// Pequeño
<StatusBadge status="warning" size="sm" />
```

---

### 4. Rating Badges (`rating-badge.tsx`)

Muestra calificaciones con estrellas.

**Props:**
```typescript
interface RatingBadgeProps {
  rating: number              // 0-5
  maxRating: number          // Default: 5
  showCount: boolean         // Default: false
  count: number              // Número de reseñas
  size: "sm" | "md" | "lg"   // Default: "md"
  variant: "filled" | "outlined"  // Default: "filled"
  className?: string
}
```

**Ejemplos:**
```tsx
// Simple
<RatingBadge rating={4.5} />

// Con conteo
<RatingBadge rating={4.8} count={342} showCount />

// Grande
<RatingBadge rating={5} size="lg" showCount count={15} />
```

---

### 5. Category Badges (`category-badge.tsx`)

Badges de categoría con iconos personalizados.

**Props:**
```typescript
interface CategoryBadgeProps {
  icon: LucideIcon
  label: string
  color: "primary" | "accent" | "secondary" | "emerald" | "amber" | "orange"
  size: "sm" | "md" | "lg"    // Default: "md"
  outlined: boolean           // Default: false
  className?: string
}
```

**Ejemplos:**
```tsx
import { Wrench, Zap, Users } from "lucide-react"

// Filled
<CategoryBadge
  icon={Wrench}
  label="Plomería"
  color="primary"
/>

// Outlined
<CategoryBadge
  icon={Zap}
  label="Electricidad"
  color="amber"
  outlined
/>

// Grande
<CategoryBadge
  icon={Users}
  label="Limpieza"
  color="emerald"
  size="lg"
/>
```

---

### 6. Info Badges (`info-badge.tsx`)

Mensajes informativos con iconos.

**Tipos:**
- `info` - Información general (Azul)
- `success` - Confirmación de éxito (Verde)
- `tip` - Consejo útil (Ámbar)
- `warning` - Advertencia (Naranja)

**Props:**
```typescript
interface InfoBadgeProps {
  type: "info" | "success" | "tip" | "warning"
  icon?: React.ReactNode           // Icono opcional
  text: string
  size: "sm" | "md" | "lg"        // Default: "md"
  dismissible: boolean            // Default: false
  onDismiss?: () => void
  className?: string
}
```

**Ejemplos:**
```tsx
// Info
<InfoBadge
  type="info"
  text="Nueva actualización disponible"
/>

// Success con dismiss
<InfoBadge
  type="success"
  text="¡Tu perfil ha sido verificado!"
  dismissible
/>

// Tip
<InfoBadge
  type="tip"
  text="Completa tu perfil para más oportunidades"
  size="lg"
/>
```

---

### 7. Feature Highlight (`feature-highlight.tsx`)

Cards para destacar features con badges opcionales.

**Props:**
```typescript
interface FeatureHighlightProps {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
  badgeColor?: "emerald" | "amber" | "orange" | "teal"
  highlighted?: boolean
  className?: string
}
```

**Ejemplos:**
```tsx
import { Shield, Zap, Award } from "lucide-react"

<FeatureHighlight
  icon={Shield}
  title="100% Seguro"
  description="Pagos protegidos y profesionales verificados"
  badge="Garantizado"
  badgeColor="emerald"
/>

<FeatureHighlight
  icon={Zap}
  title="Respuesta Rápida"
  description="Encuentra profesionales en minutos"
  highlighted
  badge="Instant"
/>
```

---

## 🎯 Casos de Uso Comunes

### En Service Cards
```tsx
import { ServiceCard } from "@/components/service-card"
import { TrustBadge } from "@/components/ui/trust-badges"
import { RatingBadge } from "@/components/ui/rating-badge"
import { StatusBadge } from "@/components/ui/status-badge"

<div className="space-y-2">
  <TrustBadge variant="verified" size="sm" />
  <RatingBadge rating={4.8} count={120} showCount size="sm" />
  <StatusBadge status="active" showLabel={false} size="sm" />
</div>
```

### En Professional Profile
```tsx
<div className="space-y-4">
  <PremiumBadge tier="platinum" />
  <TrustBadgesGroup
    badges={["verified", "expert", "fast"]}
    size="md"
    showLabels
  />
  <RatingBadge rating={4.9} count={500} showCount />
</div>
```

### En Dashboard
```tsx
<div className="space-y-3">
  <StatusBadge status="active" animated showLabel />
  <InfoBadge
    type="tip"
    text="Tienes 3 nuevas solicitudes"
    dismissible
  />
</div>
```

### En Landing Page
```tsx
<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
  <FeatureHighlight
    icon={Shield}
    title="Seguro"
    description="Pagos protegidos"
    badge="Guaranteed"
    badgeColor="emerald"
  />
  {/* Más features... */}
</div>
```

---

## 🎨 Personalización con Classes

Todos los componentes aceptan un `className` prop para personalización:

```tsx
<TrustBadge
  variant="verified"
  className="my-custom-class"
/>

<StatusBadge
  status="active"
  className="ring-2 ring-accent"
/>
```

---

## 🌙 Dark Mode

Todos los componentes tienen soporte completo para dark mode:

```tsx
// Automático - se adapta al tema
<TrustBadge variant="verified" showLabel />

// El componente maneja automáticamente:
// - Colores en light mode
// - Colores en dark mode
// - Contraste óptimo
// - Sombras apropiadas
```

---

## 📱 Responsividad

Todos los componentes son totalmente responsivos:

```tsx
// Automático escalado
<TrustBadge size="sm" />   // Mobile
<TrustBadge size="md" />   // Tablet
<TrustBadge size="lg" />   // Desktop
```

---

## 🎬 Animaciones

Algunos componentes incluyen animaciones opcionales:

```tsx
// Pulse animation
<PremiumBadge tier="diamond" animated />

// Pulse dot
<StatusBadge status="active" animated />

// Fade in animations en Marketplace Showcase
<MarketplaceShowcase />
```

---

## 📋 Palette de Colores

Los componentes usan la paleta de Fixia:

```
Primary (Teal):     #295F4F - Confianza, seguridad
Accent (Emerald):   #10B981 - Éxito, crecimiento
Secondary (Sand):   #D4A574 - Calidez, acceso
Amber:              Premiums, tips
Orange:             Warnings, important
Red:                Errors, favorites
Green:              Success, verified
```

---

## 🚀 Performance

Todos los componentes son:
- ✅ Ligeros (sin dependencias extra)
- ✅ Optimizados (CSS puro, sin JavaScript pesado)
- ✅ Accesibles (WCAG compliant)
- ✅ SEO friendly

---

## 💡 Tips & Tricks

### Combinar Badges
```tsx
<div className="flex flex-wrap gap-2">
  <TrustBadge variant="verified" size="sm" />
  <PremiumBadge tier="gold" size="sm" />
  <StatusBadge status="active" size="sm" showLabel={false} />
</div>
```

### Animaciones Sincronizadas
```tsx
<MarketplaceShowcase />  // Ya incluye animaciones staggered
```

### Usando en Listas
```tsx
{professionals.map(pro => (
  <div key={pro.id}>
    <h3>{pro.name}</h3>
    <TrustBadgesGroup
      badges={pro.badges}
      size="sm"
    />
  </div>
))}
```

---

## 📚 Archivos de Componentes

```
src/components/
├── ui/
│   ├── trust-badges.tsx
│   ├── premium-badge.tsx
│   ├── status-badge.tsx
│   ├── rating-badge.tsx
│   ├── category-badge.tsx
│   ├── info-badge.tsx
│   └── feature-highlight.tsx
└── marketplace-showcase.tsx
```

---

## 🎯 Próximos Pasos

Para máximo impacto, integra estos componentes en:

1. **Service Cards** - Agregar badges de estado y confianza
2. **Professional Profiles** - Mostrar verificación y premiums
3. **Dashboard** - Status updates y info badges
4. **Product Pages** - Feature highlights
5. **Search Results** - Badges de categoría y rating

---

**Última actualización:** Commit 1df6ed6
**Componentes:** 7 + 1 Showcase
**Líneas de código:** 994
