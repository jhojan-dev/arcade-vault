# SPEC 01 — MVP visual: todas las pantallas de Arcade Vault

> **Status:** Approved
> **Depends on:** —
> **Date:** 2026-09-06
> **Objective:** Implementar todas las pantallas visuales del MVP (Home, About, Biblioteca, Detalle, Player, Auth, Salón de la Fama) con navegación funcional, datos mock y estética retro-arcade, sin implementar juegos reales.

---

## Scope

**In:**

- Pantalla **Home** (landing): hero con siluetas flotantes, sección "Por qué Arcade Vault", preview de juegos, stats, actividad en vivo (ticker + top jugadores), pricing/FAQ y CTA final.
- Pantalla **About**: sección misión + highlights, divider animado pixelado, formulario de contacto con animación terminal de envío exitoso.
- Pantalla **Biblioteca**: catálogo de juegos con tarjetas con efecto tilt, barra de búsqueda, chips de categoría (TODOS, ARCADE, PUZZLE, SHOOTER, VERSUS), grid responsive.
- Pantalla **Detalle**: ficha de juego con cover art CSS, tags, descripción larga, stat strip (partidas/mejor/dificultad), leaderboard de 10 posiciones, botones "JUGAR AHORA" y "VOLVER".
- Pantalla **Player** (Reproductor): HUD del jugador (nombre, puntuación, vidas, nivel), pantalla CRT simulada con arena de juego placeholder, controles de pausa/fin, modal "FIN DEL JUEGO" con guardado de puntuación y reinicio.
- Pantalla **Auth**: card con tabs "INICIAR SESIÓN" / "CREAR CUENTA", campos de usuario/email/contraseña, botón "JUGAR COMO INVITADO", botones sociales (Google, GitHub).
- Pantalla **Salón de la Fama**: podio de top 3 (gold/silver/bronze) con animaciones, tabla de 12 posiciones por juego con tabs, fila destacada del usuario logueado ("TU MEJOR MARCA").
- **Nav** sticky: logo animado, links (Inicio, Biblioteca, Salón de la Fama, Acerca de), contador de créditos, botón auth/logout, menú mobile slide-in con backdrop.
- **Footer**: línea de copyright "© 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0".
- **Datos mock**: array GAMES (8 juegos), array CATS (5 categorías), array PLAYERS (18 nombres), función seededScores para leaderboard determinista.
- **Fondo visual**: perspective grid animada, scanlines, ruido SVG, vignette — todo en CSS puro.
- **Persistencia**: usuario en localStorage (`av_user`), puntuaciones guardadas en localStorage (`av_scores`).
- **Responsive**: breakpoints en 720px, 840px, 900px, 980px, 1100px — menú hamburger mobile, grid adaptativo.

**Out of scope (for future specs):**

- Implementación de juegos reales (cada juego será un spec separado).
- Backend, API, base de datos real.
- Autenticación real (OAuth, JWT, sesiones server-side).
- Sistema de puntuaciones persistido en servidor.
- Multiplayer.
- Sistema de créditos/monedas real.
- Notificaciones, chat, perfiles de usuario extendidos.
- PWA, service worker, modo offline.

---

## Data model

```typescript
// lib/data.ts

interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
  cover: string; // CSS class: "cover-bricks", "cover-tetro", etc.
  color: "cyan" | "magenta" | "yellow" | "green";
  best: number;
  plays: string;
}

interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string; // "DD/MM/YYYY"
}

interface User {
  name: string; // max 10 chars, uppercase
}

interface SavedScore {
  game: string;
  score: number;
  name: string;
  at: number; // Date.now()
}
```

Conventions:

- Los datos mock son arrays hardcodeados en `lib/data.ts` como `const` exportados con tipo.
- `seededScores(seed, count)` genera leaderboard determinista a partir de un seed numérico.
- El routing usa rutas de archivo de Next.js App Router (no hash routing).

---

## Implementation plan

1. **Configurar layout raíz y globals.css.** Actualizar `app/layout.tsx` para incluir las fuentes Google (Press Start 2P, JetBrains Mono) y el background visual (av-bg, av-noise) en el body. Verificar que `app/globals.css` tiene los tokens Tailwind y las variables CSS del template. `npm run dev` debe arrancar sin errores.

2. **Crear `lib/data.ts` con datos mock.** Exportar `GAMES`, `CATS`, `PLAYERS` y la función `seededScores` tipados en TypeScript. Verificar importación desde un page.tsx de prueba.

3. **Crear componente `Nav` en `components/nav.tsx`.** Implementar la barra de navegación sticky con logo, links (Inicio, Biblioteca, Salón de la Fama, Acerca de), contador de créditos, botón auth/logout, y menú mobile slide-in. Usar `next/link` para navegación. El estado del usuario se lee de un Context o prop.

4. **Crear componente `Footer` en `components/footer.tsx`.** Línea simple con copyright y estilo mono.

5. **Crear `app/(main)/layout.tsx`** como layout de grupo que envuelve Nav + children + Footer.

6. **Implementar pantalla Home en `app/(main)/page.tsx` o `app/page.tsx`.** Hero con siluetas SVG flotantes (FloatingSilhouettes), sección features (4 feature cards con iconos SVG pixel-art), mini-rail de 6 juegos, stats (3 bloques), actividad en vivo (ticker + top 5 jugadores), pricing card + FAQ, CTA final. IntersectionObserver para animaciones reveal.

7. **Implementar pantalla About en `app/about/page.tsx`** (o `app/(main)/about/page.tsx`). Hero con misión, highlights row (3 cards), divider animado con pixels parpadeantes, formulario de contacto con validación shake + animación terminal de éxito.

8. **Implementar pantalla Biblioteca en `app/biblioteca/page.tsx`.** Hero con título flicker, barra de búsqueda, chips de filtro, grid de GameCards con efecto tilt (onMouseMove/onMouseLeave), estado vacío "NO HAY RESULTADOS".

9. **Implementar pantalla Detalle en `app/detalle/[id]/page.tsx`.** Cover art CSS a ancho completo, tags, título, descripción, stat strip (3 columnas: partidas, mejor global, dificultad con estrellas), leaderboard sidebar con 10 rows, botones de acción. Usar `useParams` para el id. Generar scores con `seededScores`.

10. **Implementar pantalla Player en `app/player/[id]/page.tsx`.** HUD con stats (jugador, puntuación, vidas, nivel), pantalla CRT con arena placeholder (grid floor, nave, enemigos animados), overlay de pausa, modal game-over con input de nombre + guardado + reinicio. Score incrementa cada 220ms con `setInterval`.

11. **Implementar pantalla Auth en `app/auth/page.tsx`.** Card centrada con tabs login/register, campos de formulario, botón invitado, divider social, botones Google/GitHub. On submit: crea usuario mock en localStorage y redirige a biblioteca.

12. **Implementar pantalla Salón de la Fama en `app/salon/page.tsx`.** Título con gradiente, tabs por juego, podio de top 3 con estilos gold/silver/bronze, tabla de 12 posiciones con animación rise, fila "TU MEJOR MARCA" si hay usuario logueado. Scores generados con `seededScores`.

13. **Crear `lib/user-context.tsx`** con React Context para el estado de usuario (nombre, login, logout). Persiste en localStorage. Se provee en el layout raíz y se consume en Nav, Auth, Player, Salón.

14. **Ajustes finales y responsive.** Verificar todos los breakpoints, transiciones, animaciones (flicker, pulse, typewriter, float, drift, gridscroll, blink), y la estética general. Verificar que `npm run build` pasa sin errores.

---

## Acceptance criteria

- [ ] `npm run dev` arranca sin errores y muestra la pantalla Home.
- [ ] Home tiene hero con siluetas flotantes, 4 feature cards, mini-rail de juegos, stats, actividad en vivo, pricing y CTA.
- [ ] Home tiene animaciones reveal al hacer scroll (IntersectionObserver).
- [ ] Navegación funciona entre todas las rutas: Home → Biblioteca → Detalle → Player → Auth → Salón → About.
- [ ] Nav es sticky, muestra logo, links activos con underline neon, contador de créditos y botón auth.
- [ ] Nav muestra menú hamburger en mobile (<840px) con panel slide-in y backdrop.
- [ ] Biblioteca muestra 8 game cards con cover art CSS, búsqueda filtra por nombre, chips filtran por categoría.
- [ ] Biblioteca muestra "NO HAY RESULTADOS" cuando la búsqueda no matchea.
- [ ] Game cards tienen efecto tilt al mover el mouse.
- [ ] Detalle muestra cover, tags, título, descripción, stat strip y leaderboard de 10 posiciones.
- [ ] Detalle genera leaderboard determinista con seededScores.
- [ ] Player muestra HUD con nombre, puntuación (incrementa), vidas y nivel.
- [ ] Player tiene pantalla CRT con arena placeholder animada.
- [ ] Player tiene modal de pausa y modal de game-over con input de nombre y guardado.
- [ ] Player guarda puntuación en localStorage al hacer click "GUARDAR PUNTUACIÓN".
- [ ] Auth tiene tabs login/register, campos de formulario y botón "JUGAR COMO INVITADO".
- [ ] Auth crea usuario mock en localStorage y redirige a biblioteca.
- [ ] Salón muestra podio de top 3 con estilos gold/silver/bronze.
- [ ] Salón muestra tabla de 12 posiciones con tabs por juego.
- [ ] Salón muestra fila "TU MEJOR MARCA" si hay usuario logueado.
- [ ] About tiene sección misión, highlights row, divider animado pixelado y formulario de contacto.
- [ ] Formulario de contacto muestra animación terminal de éxito al enviar.
- [ ] Footer muestra copyright correcto.
- [ ] Fondo visual (grid perspectiva, scanlines, ruido) está presente en todas las pantallas.
- [ ] Responsive funciona en mobile (<720px), tablet (720-900px) y desktop (>900px).
- [ ] `npm run build` completa sin errores.
- [ ] Todas las animaciones CSS (flicker, pulse, float, blink, drift, gridscroll, typewriter, rise, fadeIn, slideIn) funcionan correctamente.

---

## Decisions

- **Yes:** Rutas de archivo Next.js App Router. Es el estándar del framework y da SEO + navegación nativa.
- **Yes:** TypeScript const en `lib/data.ts` para datos mock. Más type-safe que JSON y más idiomatico en un proyecto TS.
- **Yes:** localStorage + useState para estado de usuario. Suficiente para MVP visual sin backend. Se encapsula en un React Context (`UserProvider`).
- **Yes:** Grupo de rutas `(main)` para layout compartido Nav+Footer. Evita duplicar layout en cada page.
- **Yes:** Pantalla Home como `app/page.tsx` (landing por defecto).
- **No:** Hash routing. Pierde beneficios de Next.js (navegación, SEO, loading states).
- **No:** JSON para datos mock. Menos type-safe y más frágil.
- **No:** Zustand/Redux para estado. Overkill para un MVP visual con un solo piece de estado (usuario).
- **No:** Implementación de juegos reales. Cada juego tendrá su propio spec e implementación futura.
- **No:** Backend o API. Este spec es puramente visual/frontend.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| Fuentes Google no cargan (offline/dev sin internet) | La config ya usa fallbacks: `system-ui, monospace` para pixel y `Courier New` para mono. El diseño degrada gracefully. |
| Cover art CSS se rompe en navegadores antiguos | Los covers usan gradientes y pseudo-elementos estándar. Sin features experimental. |
| Animaciones CSS causan jank en devices低端 | Las animaciones usan `transform` y `opacity` (compositable). El fallback es simplemente sin animación. |
| Next.js 16 breaking changes en APIs de params/searchParams | Los params son async en Next.js 16. Se usa `await props.params` y `PageProps<'/route'>` type-safe helper. |

---

## What is **not** in this spec

- Juegos reales (cada juego es un spec futuro).
- Backend, API, base de datos.
- Autenticación real.
- Puntuaciones persistidas en servidor.
- Multiplayer.
- Sistema de créditos/monedas real.
- Notificaciones, chat, perfiles extendidos.
- PWA / service worker.

Cada uno de estos, si llega, va en su propio spec.
