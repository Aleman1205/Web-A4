const NAV_ITEMS = [
  { id: "profile", href: "#profile", label: "Perfil" },
  { id: "admin", href: "#admin", label: "Usuarios" },
  { id: "login", href: "#login", label: "Login" },
];

export function createAppBar(currentView) {
  const header = document.createElement("header");
  header.className = "app-bar";

  const brand = document.createElement("div");
  brand.className = "brand";
  brand.innerHTML = `
    <strong class="brand-title">T3 / REST UI</strong>
    <span class="brand-copy">Panel sencillo para revisar salud del API y operar los CRUD de users y login.</span>
  `;

  const nav = document.createElement("nav");
  nav.className = "nav";
  nav.setAttribute("aria-label", "Secciones");

  NAV_ITEMS.forEach((item) => {
    const link = document.createElement("a");
    link.className = item.id === currentView ? "nav-link active" : "nav-link";
    link.href = item.href;
    link.textContent = item.label;
    nav.append(link);
  });

  header.append(brand, nav);

  return header;
}
