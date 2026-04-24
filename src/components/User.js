function buildDetail(detail) {
  const wrapper = document.createElement("div");
  wrapper.className = "detail";

  const label = document.createElement("span");
  label.className = "detail-label";
  label.textContent = detail.label;

  const value = document.createElement("span");
  value.className = "detail-value";
  value.textContent = detail.value;

  wrapper.append(label, value);
  return wrapper;
}

export function createRecordCard({
  title,
  meta,
  details,
  onEdit,
  onDelete,
}) {
  const card = document.createElement("article");
  card.className = "record-card";

  const head = document.createElement("div");
  head.className = "record-head";

  const headerContent = document.createElement("div");

  const titleNode = document.createElement("h3");
  titleNode.className = "record-title";
  titleNode.textContent = title;

  const metaNode = document.createElement("div");
  metaNode.className = "record-meta";
  metaNode.textContent = meta;

  headerContent.append(titleNode, metaNode);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "button secondary";
  editButton.textContent = "Editar";
  editButton.addEventListener("click", onEdit);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "button";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", onDelete);

  actions.append(editButton, deleteButton);
  head.append(headerContent, actions);

  const detailGrid = document.createElement("div");
  detailGrid.className = "record-details";
  details.forEach((detail) => {
    detailGrid.append(buildDetail(detail));
  });

  card.append(head, detailGrid);

  return card;
}
