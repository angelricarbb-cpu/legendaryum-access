
# Plan: Community Section - Stories + Feed Social

## Objetivo
Transformar la seccion de comunidad actual en una experiencia social tipo Instagram/TikTok con Stories circulares animadas y un feed de actividad reciente en tiempo real.

---

## Vista Previa del Diseño

```text
+------------------------------------------+
|         LEGENDARYUM COMMUNITY            |
|        La comunidad mas activa           |
+------------------------------------------+
|  STORIES (avatares circulares animados)  |
|  [O] [O] [O] [O] [O] [O] [O] [+]         |
|   ^-- borde gradiente animado si no visto|
+------------------------------------------+
|  ACTIVIDAD RECIENTE           [Ver todo] |
|  +--------------------------------------+|
|  | [Avatar] @player1 gano 500 puntos   ||
|  |          en Campaign X   icono   2m ||
|  +--------------------------------------+|
|  | [Avatar] @player2 alcanzo Top 10    ||
|  |          en Rankings    icono    5m ||
|  +--------------------------------------+|
|  | [Avatar] @player3 completo mision   ||
|  |          "Dragon Slayer"icono   10m ||
|  +--------------------------------------+|
+------------------------------------------+
```

---

## Estructura de Archivos

| Archivo | Accion |
|---------|--------|
| `src/components/home/CommunitySection.tsx` | Reescribir completamente |
| `src/components/home/community/StoryAvatar.tsx` | Crear nuevo |
| `src/components/home/community/ActivityFeedItem.tsx` | Crear nuevo |
| `tailwind.config.ts` | Añadir animacion de rotacion para el borde del story |
| `src/index.css` | Añadir estilos CSS para el gradiente animado del story ring |

---

## Detalles de Implementacion

### 1. StoryAvatar Component
Componente para cada "story" circular con:
- Avatar circular con borde gradiente animado (si no visto)
- Borde gris estatico si ya fue visto
- Username truncado debajo
- Animacion de escala al hover
- Click para marcar como visto (simular apertura de story)

```typescript
interface StoryUser {
  id: string;
  username: string;
  avatar?: string;
  hasUnseenStory: boolean;
  plan: "free" | "premium" | "growth" | "scale";
}
```

### 2. ActivityFeedItem Component
Cada item del feed mostrara:
- Avatar del usuario (pequeño, 32px)
- Username con link
- Descripcion de la actividad
- Icono segun tipo (trofeo, mision, juego, evento)
- Tiempo relativo ("hace 2m", "hace 1h")
- Animacion fade-in staggered

```typescript
interface ActivityItem {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  type: "points" | "ranking" | "mission" | "game" | "achievement";
  description: string;
  target?: string; // nombre de campana, mision, etc.
  points?: number;
  timestamp: Date;
}
```

### 3. CommunitySection Principal
Estructura del componente padre:
- Header con titulo y subtitulo
- Seccion Stories con scroll horizontal
- Boton "+" al final para ver mas usuarios
- Seccion Feed con lista vertical (3-4 items visibles)
- Boton "Ver todo" para expandir o navegar

### 4. Datos Mock
Crear datos de ejemplo realistas para:
- 8-10 usuarios con stories
- 5-6 actividades recientes variadas
- Mezcla de tipos de actividad

### 5. Animaciones
- **Story Ring**: Rotacion continua del gradiente con CSS animation
- **Feed Items**: Fade-in con delay escalonado
- **Hover Effects**: Scale y glow en stories
- **Transition**: Cambio de estado visto/no visto

---

## Detalles Tecnicos

### CSS para Story Ring Animado
```css
@keyframes story-ring-rotate {
  from { --angle: 0deg; }
  to { --angle: 360deg; }
}

.story-ring-unseen {
  background: conic-gradient(
    from var(--angle),
    hsl(var(--primary)),
    hsl(var(--accent)),
    hsl(var(--primary))
  );
  animation: story-ring-rotate 3s linear infinite;
}
```

### Tailwind Config
Añadir keyframe `spin-slow` para rotacion lenta del ring.

### Iconos por Tipo de Actividad
| Tipo | Icono (lucide) | Color |
|------|----------------|-------|
| points | Coins | yellow |
| ranking | Trophy | orange |
| mission | Target | blue |
| game | Gamepad2 | green |
| achievement | Award | purple |

### Tiempo Relativo
Utilizar `date-fns` (ya instalado) con `formatDistanceToNow` para mostrar "hace X minutos/horas".

---

## Integracion con Auth
- Si el usuario esta logueado, mostrar boton "Tu Story" al inicio
- Los stories pueden mostrar badge de plan del usuario
- El feed puede filtrar por usuarios seguidos (futuro)

---

## Resultado Esperado
Una seccion de comunidad visualmente impactante que:
1. Genera curiosidad con los stories animados
2. Muestra actividad viva de la plataforma
3. Incentiva a participar para aparecer en el feed
4. Mantiene la estetica gaming/dark del proyecto
