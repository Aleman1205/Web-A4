export function createProfileView({
  home,
  ping,
  userCount,
  loginCount,
  loading,
  onRefresh,
}) {
  const view = document.createElement("section");
  view.className = "view";

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <span class="eyebrow">PROFESSIONAL / MEDIUM ENERGY / GENERAL PUBLIC</span>
    <h1>Control claro para una API que ya está lista para operar.</h1>
    <p class="hero-copy">${loading ? "Cargando estado..." : home?.message || "API REST lista."}</p>
    <p class="hero-subcopy">
      Esta interfaz mantiene el contrato de la API en la raíz y mueve el panel visual a <a href="/app/">/app/</a>.
      Desde aquí puedes validar salud, revisar rutas y operar los recursos disponibles.
    </p>
    <div class="inline-actions">
      <button type="button" class="button accent" id="reload-dashboard">Recargar panel</button>
      <a class="button ghost" href="/" target="_blank" rel="noreferrer">Ver JSON raíz</a>
      <a class="button ghost" href="/ping" target="_blank" rel="noreferrer">Probar ping</a>
    </div>
  `;

  hero.querySelector("#reload-dashboard").addEventListener("click", onRefresh);

  const stats = document.createElement("section");
  stats.className = "grid-three";
  stats.innerHTML = `
    <article class="panel accent">
      <span class="stat-label">Ping</span>
      <strong class="stat-value">${ping?.message || "..."}</strong>
      <p class="small-copy">Respuesta rápida del endpoint de salud.</p>
    </article>
    <article class="panel">
      <span class="stat-label">Usuarios</span>
      <strong class="stat-value">${userCount}</strong>
      <p class="small-copy">Registros persistidos en <code>data/database.json</code>.</p>
    </article>
    <article class="panel secondary">
      <span class="stat-label">Login</span>
      <strong class="stat-value">${loginCount}</strong>
      <p class="small-copy">Colección CRUD separada para los accesos.</p>
    </article>
  `;

  const details = document.createElement("section");
  details.className = "grid-two";

  const routes = document.createElement("article");
  routes.className = "panel";
  routes.innerHTML = `
    <div class="section-head">
      <div>
        <h2 class="section-title">Rutas activas</h2>
        <p class="section-copy">Contrato actual publicado por el backend.</p>
      </div>
    </div>
  `;

  const routeList = document.createElement("div");
  routeList.className = "route-list";

  const endpoints = Array.isArray(home?.endpoints) ? home.endpoints : [];
  endpoints.forEach((endpoint) => {
    const item = document.createElement("div");
    item.className = "route-item";
    item.innerHTML = `
      <span>${endpoint}</span>
      <a href="${endpoint}" target="_blank" rel="noreferrer">abrir</a>
    `;
    routeList.append(item);
  });

  routes.append(routeList);

  const note = document.createElement("article");
  note.className = "panel accent";
  note.innerHTML = `
    <div>
      <h2 class="section-title">Sistema visual</h2>
      <p class="section-copy">
        Fondo negro, bloques rectos, acentos duros en amarillo y una voz visual monoespaciada para
        sostener una interfaz directa y sobria.
      </p>
    </div>
    <p class="hero-subcopy">
      Los encabezados usan la escala pedida de 57.6px como techo visual y el resto del UI baja de tamaño
      para mantener lectura, formularios y acciones realmente utilizables.
    </p>
  `;

  details.append(routes, note);
  view.append(hero, stats, details);

  return view;
}
