const db = require("../utils/fileDb.js");
const httpError = require("../utils/httpError.js");

function normalizeUserPayload(body, isUpdate = false) {
  const payload = {};

  if (!isUpdate && (body.name === undefined || body.email === undefined)) {
    throw httpError(400, "Los campos name y email son obligatorios");
  }

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) {
      throw httpError(400, "El campo name no puede estar vacio");
    }
    payload.name = name;
  }

  if (body.email !== undefined) {
    const email = String(body.email).trim().toLowerCase();
    if (!email || !email.includes("@")) {
      throw httpError(400, "El campo email no es valido");
    }
    payload.email = email;
  }

  if (isUpdate && Object.keys(payload).length === 0) {
    throw httpError(400, "Debes enviar al menos un campo para actualizar");
  }

  return payload;
}

async function createUser(req, res, next) {
  try {
    const payload = normalizeUserPayload(req.body);
    const users = await db.list("users");

    if (users.some((user) => user.email === payload.email)) {
      throw httpError(409, "Ya existe un usuario con ese email");
    }

    const user = await db.create("users", payload);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await db.list("users");
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await db.findById("users", req.params.id);

    if (!user) {
      throw httpError(404, "Usuario no encontrado");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const currentUser = await db.findById("users", req.params.id);

    if (!currentUser) {
      throw httpError(404, "Usuario no encontrado");
    }

    const payload = normalizeUserPayload(req.body, true);
    const users = await db.list("users");

    if (
      payload.email &&
      users.some(
        (user) => user.id !== currentUser.id && user.email === payload.email
      )
    ) {
      throw httpError(409, "Ya existe un usuario con ese email");
    }

    const updatedUser = await db.update("users", req.params.id, payload);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const deletedUser = await db.remove("users", req.params.id);

    if (!deletedUser) {
      throw httpError(404, "Usuario no encontrado");
    }

    res.json({
      message: "Usuario eliminado",
      data: deletedUser,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
};
