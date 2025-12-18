# 🎯 Badge Integration Guide - Fixia Marketplace

Guía completa para usar los componentes integrados de badges en tus páginas.

---

## 📋 Tabla de Contenidos

1. [Service Cards](#service-cards)
2. [Professional Profiles](#professional-profiles)
3. [Admin Dashboard](#admin-dashboard)
4. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## Service Cards

### Ubicación
`src/components/service-card.tsx`

### Props Nuevas

```typescript
interface ServiceCardProps {
  // ... props existentes ...
  isVerified?: boolean  // Default: true - muestra verified badge
  isFast?: boolean      // Default: false - muestra fast badge
  isPremium?: boolean   // Default: false - muestra premium badge
}
```

### Ejemplo de Uso

```tsx
import { ServiceCard } from "@/components/service-card"

export function MyServicesList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ServiceCard
        title="Reparación de Plomería"
        providerName="Juan García"
        providerAvatar="/avatars/juan.jpg"
        rating={4.8}
        reviewsCount={120}
        price={2500}
        image="/services/plumbing.jpg"
        category="Plomería"
        location="Buenos Aires"
        isVerified={true}
        isFast={true}
        isPremium={false}
      />
    </div>
  )
}
```

### Badges Mostrados

- **isVerified=true**: Checkmark verde junto al nombre (Verified badge)
- **isFast=true**: Badge naranja de respuesta rápida bajo el nombre
- **rating**: RatingBadge con estrellas + conteo de reseñas

---

## Professional Profiles

### Ubicación
`src/components/professional-profile-card.tsx`

### Props

```typescript
interface ProfessionalProfileCardProps {
  id: string
  name: string
  title: string
  avatar: string
  coverImage?: string
  rating: number
  reviewsCount: number
  completedJobs: number
  location: string
  bio: string
  phone?: string
  email?: string
  website?: string
  isVerified: boolean
  isPremium?: "gold" | "platinum" | "diamond"
  badges?: Array<"verified" | "expert" | "fast" | "secure" | "favorite" | "trending">
  responseTime?: string
  onMessage?: () => void
  onHire?: () => void
}
```

### Ejemplo de Uso

```tsx
import { ProfessionalProfileCard } from "@/components/professional-profile-card"

export function ProfessionalsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProfessionalProfileCard
        id="pro-001"
        name="María López"
        title="Electricista Certificada"
        avatar="/avatars/maria.jpg"
        coverImage="/covers/electrical.jpg"
        rating={4.9}
        reviewsCount={342}
        completedJobs={156}
        location="CABA, Argentina"
        bio="Especialista en instalaciones eléctricas residenciales. 15 años de experiencia garantizando seguridad y eficiencia."
        phone="+54 9 11 2345-6789"
        email="maria@fixia.app"
        website="https://maria-electricista.com"
        isVerified={true}
        isPremium="platinum"
        badges={["verified", "expert", "fast", "secure"]}
        responseTime="< 2h"
        onMessage={() => console.log("Message clicked")}
        onHire={() => console.log("Hire clicked")}
      />
    </div>
  )
}
```

### Características

**Header:**
- Cover image (opcional)
- Avatar con borde y sombra
- Nombre + título
- Premium badge (si aplica)

**Trust Section:**
- TrustBadgesGroup con múltiples badges
- Muestra verificación, experticia, velocidad, etc.

**Stats:**
- Trabajos completados
- Rating con reseñas
- Tiempo de respuesta

**Contact:**
- Ubicación, teléfono, email, website
- Iconos para cada tipo de contacto

**Actions:**
- Botón Mensaje
- Botón Contratar
- Callbacks personalizables

---

## Admin Dashboard

### Ubicación
`src/app/admin/page.tsx`

### Características Nuevas

#### Header Section
- Status badge animado (Sistema operativo)
- Smart alerts con InfoBadge
- Auto-muestra warnings si hay verificaciones pendientes

#### Stat Cards

Cada tarjeta ahora tiene:
- Icono accent color
- Status badge apropiado (active/warning)
- Gradiente sutil background
- Animación entrance staggered

**Card 1 - Usuarios Totales:**
```tsx
<StatusBadge status="active" showLabel={false} size="sm" animated />
```

**Card 2 - Solicitudes:**
```tsx
<StatusBadge status="active" showLabel={false} size="sm" />
```

**Card 3 - Verificaciones Pendientes:**
```tsx
<StatusBadge status="warning" showLabel={false} size="sm" animated />
// + background orange warning
```

**Card 4 - Ingresos:**
```tsx
<StatusBadge status="active" showLabel={false} size="sm" />
// + background emerald success
```

#### Top Profesionales
- Ranking badges con gradientes
- Status badges animados
- Animated row entrance
- Better visual hierarchy

### Ejemplo de Integración

```tsx
import { StatusBadge } from "@/components/ui/status-badge"
import { InfoBadge } from "@/components/ui/info-badge"

export function MyAdminPage() {
  const [stats, setStats] = useState<any>(null)

  return (
    <div className="space-y-8">
      {/* Status Alert */}
      {stats?.verifications?.pending > 5 && (
        <InfoBadge
          type="warning"
          text={`⚠️ ${stats.verifications.pending} verificaciones pendientes`}
          dismissible
        />
      )}

      {/* System Status */}
      <StatusBadge status="active" showLabel animated />

      {/* Card with Status */}
      <Card>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users}</div>
          <StatusBadge status="active" showLabel={false} size="sm" />
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Ejemplos Prácticos

### 1. Página de Servicios con Badges

```tsx
import { ServiceCard } from "@/components/service-card"

export function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Plomería",
      providerName: "Carlos Martínez",
      rating: 4.8,
      reviewsCount: 89,
      price: 2500,
      image: "/services/plumbing.jpg",
      category: "Plomería",
      location: "Buenos Aires",
      isVerified: true,
      isFast: true,
    },
    {
      id: 2,
      title: "Electricidad",
      providerName: "Ana García",
      rating: 4.9,
      reviewsCount: 156,
      price: 3000,
      image: "/services/electrical.jpg",
      category: "Electricidad",
      location: "CABA",
      isVerified: true,
      isFast: false,
    },
  ]

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Servicios Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  )
}
```

### 2. Directorio de Profesionales

```tsx
import { ProfessionalProfileCard } from "@/components/professional-profile-card"

export function ProfessionalsDirectory() {
  const professionals = [
    {
      id: "pro-001",
      name: "Juan Pérez",
      title: "Plomero Profesional",
      avatar: "/avatars/juan.jpg",
      rating: 4.7,
      reviewsCount: 98,
      completedJobs: 87,
      location: "Buenos Aires",
      bio: "Especialista en reparaciones de cañerías...",
      isVerified: true,
      isPremium: "gold",
      badges: ["verified", "fast", "expert"],
      responseTime: "< 1h",
    },
  ]

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Nuestros Profesionales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {professionals.map((pro) => (
          <ProfessionalProfileCard
            key={pro.id}
            {...pro}
            onMessage={() => openChat(pro.id)}
            onHire={() => startHiring(pro.id)}
          />
        ))}
      </div>
    </div>
  )
}
```

### 3. Dashboard Mixto con Badges

```tsx
import { ServiceCard } from "@/components/service-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { RatingBadge } from "@/components/ui/rating-badge"

export function MixedDashboard() {
  return (
    <div className="space-y-8">
      {/* Section 1: Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-sm text-muted-foreground">Servicios Activos</p>
            <StatusBadge status="active" size="sm" showLabel={false} />
          </CardContent>
        </Card>
        {/* More cards... */}
      </div>

      {/* Section 2: Top Services */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Servicios Populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ServiceCard components */}
        </div>
      </div>

      {/* Section 3: Top Professionals */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Profesionales Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ProfessionalProfileCard components */}
        </div>
      </div>
    </div>
  )
}
```

---

## 🎯 Best Practices

### Service Cards
- Siempre marcar `isVerified={true}` para profesionales verificados
- Usar `isFast={responseTime < 2}` basado en datos reales
- Proporcionar `rating` y `reviewsCount` para confianza

### Professional Profiles
- Completar todos los campos opcionales cuando sea posible
- Usar `isPremium` para diferenciar profesionales destacados
- Agregar múltiples badges (`badges` array) para credibilidad
- Implementar `onMessage` y `onHire` callbacks

### Admin Dashboard
- Usar `status="warning"` para alertas importantes
- Implementar `InfoBadge` para notificaciones smart
- Mostrar `StatusBadge` animado en métricas clave
- Actualizar dinámicamente basado en datos reales

---

## 🎨 Customización

### Colores
Los componentes usan la paleta de Fixia:
- Primary (Teal): `#295F4F`
- Accent (Emerald): `#10B981`
- Secondary (Sand): `#D4A574`

Para personalizar, edita `src/app/globals.css`

### Tamaños
Todos los badges soportan: `"sm" | "md" | "lg"`

### Animaciones
Para desabilitar animaciones:
```tsx
<StatusBadge status="active" animated={false} />
<PremiumBadge tier="gold" animated={false} />
```

---

## 🧪 Testing

### Mobile
- Prueba en viewport 375px (iPhone SE)
- Prueba en viewport 768px (iPad)
- Prueba en viewport 1024px (Desktop)

### Dark Mode
- Verifica todos los componentes en modo oscuro
- Las sombras y colores deben ajustarse automáticamente

### Responsividad
- Cards deben stackear en mobile
- Badges deben ser pequeños en mobile, medianos en desktop
- Text debe ser legible en todos los tamaños

---

## 📚 Documentación Relacionada

- [Badge Components Guide](./BADGE_COMPONENTS.md)
- [Global Styles](./src/app/globals.css)
- [Component Library](./src/components/)

---

**Última actualización:** Commit f374a42
**Componentes en producción:** 3 (ServiceCard, ProfessionalProfileCard, Admin Dashboard)
