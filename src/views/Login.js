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

export function createLoginView({
  records,
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
  head.className = "panel secondary";
  head.innerHTML = `
    <div class="section-head">
      <div>
        <h1 class="section-title">Login</h1>
        <p class="section-copy">CRUD completo para la colección <code>login</code> sin exponer hashes en la interfaz.</p>
      </div>
      <p class="small-copy">${records.length} registro(s) disponibles.</p>
    </div>
  `;

  const layout = document.createElement("section");
  layout.className = "resource-layout";

  const form = createAddForm({
    title: formMode === "edit" ? "Actualizar acceso" : "Crear acceso",
    description:
      formMode === "edit"
        ? "Puedes cambiar username y enviar password nueva solo si hace falta."
        : "Crea un registro con username y password. El password se almacena como hash.",
    fields: [
      {
        name: "username",
        label: "Username",
        placeholder: "admin",
        autocomplete: "username",
        required: true,
      },
      {
        name: "password",
        label: formMode === "edit" ? "Password nueva" : "Password",
        type: "password",
        placeholder: formMode === "edit" ? "Deja vacio para conservarla" : "Minimo 4 caracteres",
        autocomplete: "new-password",
        required: formMode !== "edit",
      },
    ],
    values: formValues,
    submitLabel: formMode === "edit" ? "Guardar acceso" : "Crear acceso",
    onCancel: formMode === "edit" ? onCancel : null,
    onSubmit,
  });

  const list = document.createElement("section");
  list.className = "records";

  if (loading) {
    const loadingCard = document.createElement("article");
    loadingCard.className = "panel";
    loadingCard.textContent = "Cargando accesos...";
    list.append(loadingCard);
  } else if (!records.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Todavia no hay registros de login.";
    list.append(empty);
  } else {
    records.forEach((record) => {
      list.append(
        createRecordCard({
          title: record.username,
          meta: `ID ${record.id}`,
          details: [
            { label: "Password", value: record.hasPassword ? "Configurada" : "No definida" },
            { label: "Creado", value: formatDate(record.createdAt) },
            { label: "Actualizado", value: formatDate(record.updatedAt) },
            { label: "Recurso", value: "/login" },
          ],
          onDelete: () => onDelete(record),
          onEdit: () => onEdit(record),
        })
      );
    });
  }

  layout.append(form, list);
  view.append(head, layout);

  return view;
}
