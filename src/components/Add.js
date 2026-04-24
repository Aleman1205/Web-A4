function createField(field, values) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const label = document.createElement("label");
  label.htmlFor = field.name;
  label.textContent = field.label;

  const input = document.createElement("input");
  input.id = field.name;
  input.name = field.name;
  input.type = field.type || "text";
  input.placeholder = field.placeholder || "";
  input.autocomplete = field.autocomplete || "off";
  input.value = values[field.name] || "";

  if (field.required) {
    input.required = true;
  }

  wrapper.append(label, input);

  return wrapper;
}

export function createAddForm({
  title,
  description,
  fields,
  values,
  submitLabel,
  cancelLabel = "Cancelar",
  onCancel,
  onSubmit,
}) {
  const panel = document.createElement("section");
  panel.className = "panel form-card";

  const heading = document.createElement("div");
  heading.innerHTML = `
    <h2 class="section-title">${title}</h2>
    <p class="section-copy">${description}</p>
  `;

  const form = document.createElement("form");
  form.className = "resource-form";

  fields.forEach((field) => {
    form.append(createField(field, values));
  });

  const actions = document.createElement("div");
  actions.className = "inline-actions";

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "button accent";
  submitButton.textContent = submitLabel;

  actions.append(submitButton);

  if (onCancel) {
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "button ghost";
    cancelButton.textContent = cancelLabel;
    cancelButton.addEventListener("click", onCancel);
    actions.append(cancelButton);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    onSubmit(Object.fromEntries(formData.entries()));
  });

  form.append(actions);
  panel.append(heading, form);

  return panel;
}
