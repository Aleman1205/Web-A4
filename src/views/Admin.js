import { createAddForm } from "../components/Add.js";
import { createRecordCard } from "../components/User.js";

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function createAdminView({
  users,
  loading,
  formMode,
  formValues,
  onCancel,
  onDelete,
  onEdit,
  onSubmit,
}) {
  const view = document.createElement("section");
  view.className = "view";

  const head = document.createElement("section");
  head.className = "panel accent";
  head.innerHTML = `
    <div class="section-head">
      <div>
        <h1 class="section-title">Usuarios</h1>
        <p class="section-copy">Alta, lectura, actualización y borrado sobre la colección <code>users</code>.</p>
      </div>
      <p class="small-copy">${users.length} registro(s) disponibles.</p>
    </div>
  `;

  const layout = document.createElement("section");
  layout.className = "resource-layout";

  const form = createAddForm({
    title: formMode === "edit" ? "Actualizar usuario" : "Crear usuario",
    description:
      formMode === "edit"
        ? "Corrige nombre o email y guarda el cambio directamente en el JSON local."
        : "Agrega un usuario con nombre y email. El email debe ser unico.",
    fields: [
      {
        name: "name",
        label: "Nombre",
        placeholder: "Ada Lovelace",
        autocomplete: "name",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "ada@example.com",
        autocomplete: "email",
        required: true,
      },
    ],
    values: formValues,
    submitLabel: formMode === "edit" ? "Guardar usuario" : "Crear usuario",
    onCancel: formMode === "edit" ? onCancel : null,
    onSubmit,
  });

  const list = document.createElement("section");
  list.className = "records";

  if (loading) {
    const loadingCard = document.createElement("article");
    loadingCard.className = "panel";
    loadingCard.textContent = "Cargando usuarios...";
    list.append(loadingCard);
  } else if (!users.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Todavia no hay usuarios registrados.";
    list.append(empty);
  } else {
    users.forEach((user) => {
      list.append(
        createRecordCard({
          title: user.name,
          meta: `ID ${user.id}`,
          details: [
            { label: "Email", value: user.email },
            { label: "Creado", value: formatDate(user.createdAt) },
            { label: "Actualizado", value: formatDate(user.updatedAt) },
            { label: "Recurso", value: "/users" },
          ],
          onDelete: () => onDelete(user),
          onEdit: () => onEdit(user),
        })
      );
    });
  }

  layout.append(form, list);
  view.append(head, layout);

  return view;
}
