const JSON_HEADERS = {
  Accept: "application/json",
};

async function request(path, options = {}) {
  const headers = {
    ...JSON_HEADERS,
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export const api = {
  createLogin(payload) {
    return request("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  createUser(payload) {
    return request("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteLogin(id) {
    return request(`/login/${id}`, {
      method: "DELETE",
    });
  },
  deleteUser(id) {
    return request(`/users/${id}`, {
      method: "DELETE",
    });
  },
  getHome() {
    return request("/");
  },
  getLogins() {
    return request("/login");
  },
  getPing() {
    return request("/ping");
  },
  getUsers() {
    return request("/users");
  },
  updateLogin(id, payload) {
    return request(`/login/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  updateUser(id, payload) {
    return request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
