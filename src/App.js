import { api } from "./api.js";

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Date(value).toLocaleString("es-MX");
}

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function createApp(root) {
  const state = {
    home: null,
    logins: [],
    message: null,
    ping: null,
    userForm: {
      email: "",
      id: null,
      name: "",
    },
    users: [],
    loginForm: {
      id: null,
      password: "",
      username: "",
    },
  };

  function setMessage(type, text) {
    state.message = { text, type };
  }

  function resetUserForm() {
    state.userForm = {
      email: "",
      id: null,
      name: "",
    };
  }

  function resetLoginForm() {
    state.loginForm = {
      id: null,
      password: "",
      username: "",
    };
  }

  async function loadHome() {
    const [home, ping] = await Promise.all([api.getHome(), api.getPing()]);
    state.home = home;
    state.ping = ping;
  }

  async function loadUsers() {
    state.users = await api.getUsers();
  }

  async function loadLogins() {
    state.logins = await api.getLogins();
  }

  async function loadAll(showSuccessMessage = false) {
    try {
      await Promise.all([loadHome(), loadUsers(), loadLogins()]);

      if (showSuccessMessage) {
        setMessage("success", "Datos actualizados.");
      }
    } catch (error) {
      setMessage("error", error.message);
    }

    render();
  }

  function renderMessage() {
    if (!state.message) {
      return "";
    }

    return `
      <div class="message ${state.message.type}">
        ${escapeHtml(state.message.text)}
      </div>
    `;
  }

  function renderEndpoints() {
    const endpoints = Array.isArray(state.home?.endpoints) ? state.home.endpoints : [];

    if (!endpoints.length) {
      return "<li>No hay datos cargados.</li>";
    }

    return endpoints
      .map((endpoint) => {
        const safeEndpoint = escapeHtml(endpoint);

        return `
          <li>
            <a href="${safeEndpoint}" target="_blank" rel="noreferrer">${safeEndpoint}</a>
          </li>
        `;
      })
      .join("");
  }

  function renderUsers() {
    if (!state.users.length) {
      return '<p class="empty-text">No hay usuarios guardados.</p>';
    }

    return state.users
      .map((user) => {
        return `
          <div class="item">
            <p><strong>Id:</strong> ${escapeHtml(user.id)}</p>
            <p><strong>Nombre:</strong> ${escapeHtml(user.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
            <p><strong>Creado:</strong> ${escapeHtml(formatDate(user.createdAt))}</p>
            <div class="item-actions">
              <button type="button" data-user-edit="${escapeHtml(user.id)}">Editar</button>
              <button type="button" class="danger" data-user-delete="${escapeHtml(user.id)}">Eliminar</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderLogins() {
    if (!state.logins.length) {
      return '<p class="empty-text">No hay registros de login.</p>';
    }

    return state.logins
      .map((record) => {
        return `
          <div class="item">
            <p><strong>Id:</strong> ${escapeHtml(record.id)}</p>
            <p><strong>Username:</strong> ${escapeHtml(record.username)}</p>
            <p><strong>Password:</strong> ${record.hasPassword ? "Guardada" : "No guardada"}</p>
            <p><strong>Creado:</strong> ${escapeHtml(formatDate(record.createdAt))}</p>
            <div class="item-actions">
              <button type="button" data-login-edit="${escapeHtml(record.id)}">Editar</button>
              <button type="button" class="danger" data-login-delete="${escapeHtml(record.id)}">Eliminar</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function render() {
    const editingUser = state.userForm.id !== null;
    const editingLogin = state.loginForm.id !== null;

    root.innerHTML = `
      <main class="page">
        <h1>Web A4 Login React conectado a Rest API</h1>
        <p class="intro">
        
        </p>

        ${renderMessage()}

        <section class="box">
          <h2>Estado de la API</h2>
          <div class="row-buttons">
            <button type="button" id="refresh-data">Cargar o recargar datos</button>
            <a href="/" target="_blank" rel="noreferrer">Ver JSON principal</a>
            <a href="/ping" target="_blank" rel="noreferrer">Ver ping</a>
          </div>
          <p><strong>Mensaje:</strong> ${escapeHtml(state.home?.message || "Sin cargar")}</p>
          <p><strong>Ping:</strong> ${escapeHtml(state.ping?.message || "Sin cargar")}</p>
          <p><strong>Total de usuarios:</strong> ${state.users.length}</p>
          <p><strong>Total de logins:</strong> ${state.logins.length}</p>
          <h3>Endpoints</h3>
          <ul>
            ${renderEndpoints()}
          </ul>
        </section>

        <section class="box">
          <h2>Usuarios</h2>
          <form id="user-form" class="simple-form">
            <label for="user-name">Nombre</label>
            <input
              id="user-name"
              name="name"
              type="text"
              value="${escapeHtml(state.userForm.name)}"
              required
            />

            <label for="user-email">Email</label>
            <input
              id="user-email"
              name="email"
              type="email"
              value="${escapeHtml(state.userForm.email)}"
              required
            />

            <div class="row-buttons">
              <button type="submit">
                ${editingUser ? "Guardar usuario" : "Agregar usuario"}
              </button>
              ${editingUser
        ? '<button type="button" class="secondary" id="cancel-user-edit">Cancelar</button>'
        : ""
      }
            </div>
          </form>

          <div class="list">
            ${renderUsers()}
          </div>
        </section>

        <section class="box">
          <h2>Login</h2>
          <form id="login-form" class="simple-form">
            <label for="login-username">Username</label>
            <input
              id="login-username"
              name="username"
              type="text"
              value="${escapeHtml(state.loginForm.username)}"
              required
            />

            <label for="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              value="${escapeHtml(state.loginForm.password)}"
              ${editingLogin ? "" : "required"}
            />

            <p class="help-text">
              ${editingLogin ? "Si no quieres cambiar la password, dejala vacia." : "La password debe tener minimo 4 caracteres."}
            </p>

            <div class="row-buttons">
              <button type="submit">
                ${editingLogin ? "Guardar login" : "Agregar login"}
              </button>
              ${editingLogin
        ? '<button type="button" class="secondary" id="cancel-login-edit">Cancelar</button>'
        : ""
      }
            </div>
          </form>

          <div class="list">
            ${renderLogins()}
          </div>
        </section>
      </main>
    `;

    root.querySelector("#refresh-data").addEventListener("click", () => {
      loadAll(true);
    });

    root.querySelector("#user-form").addEventListener("submit", handleUserSubmit);
    root.querySelector("#login-form").addEventListener("submit", handleLoginSubmit);

    const cancelUserButton = root.querySelector("#cancel-user-edit");
    if (cancelUserButton) {
      cancelUserButton.addEventListener("click", () => {
        resetUserForm();
        render();
      });
    }

    const cancelLoginButton = root.querySelector("#cancel-login-edit");
    if (cancelLoginButton) {
      cancelLoginButton.addEventListener("click", () => {
        resetLoginForm();
        render();
      });
    }

    root.querySelectorAll("[data-user-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.userEdit);
        const user = state.users.find((item) => item.id === id);

        if (!user) {
          return;
        }

        state.userForm = {
          email: user.email || "",
          id: user.id,
          name: user.name || "",
        };

        render();
      });
    });

    root.querySelectorAll("[data-user-delete]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = Number(button.dataset.userDelete);
        const confirmed = window.confirm("Quieres eliminar este usuario?");

        if (!confirmed) {
          return;
        }

        try {
          await api.deleteUser(id);
          setMessage("success", "Usuario eliminado.");
          await loadUsers();
        } catch (error) {
          setMessage("error", error.message);
        }

        render();
      });
    });

    root.querySelectorAll("[data-login-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.loginEdit);
        const record = state.logins.find((item) => item.id === id);

        if (!record) {
          return;
        }

        state.loginForm = {
          id: record.id,
          password: "",
          username: record.username || "",
        };

        render();
      });
    });

    root.querySelectorAll("[data-login-delete]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = Number(button.dataset.loginDelete);
        const confirmed = window.confirm("Quieres eliminar este login?");

        if (!confirmed) {
          return;
        }

        try {
          await api.deleteLogin(id);
          setMessage("success", "Login eliminado.");
          await loadLogins();
        } catch (error) {
          setMessage("error", error.message);
        }

        render();
      });
    });
  }

  async function handleUserSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") || "").trim(),
      name: String(formData.get("name") || "").trim(),
    };

    try {
      if (state.userForm.id !== null) {
        await api.updateUser(state.userForm.id, payload);
        setMessage("success", "Usuario actualizado.");
      } else {
        await api.createUser(payload);
        setMessage("success", "Usuario creado.");
      }

      resetUserForm();
      await loadUsers();
    } catch (error) {
      setMessage("error", error.message);
    }

    render();
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "").trim();

    try {
      if (state.loginForm.id !== null) {
        const payload = { username };

        if (password) {
          payload.password = password;
        }

        await api.updateLogin(state.loginForm.id, payload);
        setMessage("success", "Login actualizado.");
      } else {
        await api.createLogin({ password, username });
        setMessage("success", "Login creado.");
      }

      resetLoginForm();
      await loadLogins();
    } catch (error) {
      setMessage("error", error.message);
    }

    render();
  }

  loadAll();
}
