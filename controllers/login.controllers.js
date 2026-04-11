const crypto = require("crypto");

const db = require("../utils/fileDb.js");
const httpError = require("../utils/httpError.js");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function sanitizeLogin(record) {
  const { passwordHash, ...safeRecord } = record;
  return {
    ...safeRecord,
    hasPassword: Boolean(passwordHash),
  };
}

function normalizeLoginPayload(body, isUpdate = false) {
  const payload = {};

  if (!isUpdate && (body.username === undefined || body.password === undefined)) {
    throw httpError(400, "Los campos username y password son obligatorios");
  }

  if (body.username !== undefined) {
    const username = String(body.username).trim();
    if (!username) {
      throw httpError(400, "El campo username no puede estar vacio");
    }
    payload.username = username;
  }

  if (body.password !== undefined) {
    const password = String(body.password).trim();
    if (password.length < 4) {
      throw httpError(400, "El password debe tener al menos 4 caracteres");
    }
    payload.passwordHash = hashPassword(password);
  }

  if (isUpdate && Object.keys(payload).length === 0) {
    throw httpError(400, "Debes enviar al menos un campo para actualizar");
  }

  return payload;
}

async function createLogin(req, res, next) {
  try {
    const payload = normalizeLoginPayload(req.body);
    const records = await db.list("login");

    if (records.some((record) => record.username === payload.username)) {
      throw httpError(409, "Ya existe un registro con ese username");
    }

    const createdRecord = await db.create("login", payload);
    res.status(201).json(sanitizeLogin(createdRecord));
  } catch (error) {
    next(error);
  }
}

async function getLogins(req, res, next) {
  try {
    const records = await db.list("login");
    res.json(records.map(sanitizeLogin));
  } catch (error) {
    next(error);
  }
}

async function getLoginById(req, res, next) {
  try {
    const record = await db.findById("login", req.params.id);

    if (!record) {
      throw httpError(404, "Registro de login no encontrado");
    }

    res.json(sanitizeLogin(record));
  } catch (error) {
    next(error);
  }
}

async function updateLogin(req, res, next) {
  try {
    const currentRecord = await db.findById("login", req.params.id);

    if (!currentRecord) {
      throw httpError(404, "Registro de login no encontrado");
    }

    const payload = normalizeLoginPayload(req.body, true);
    const records = await db.list("login");

    if (
      payload.username &&
      records.some(
        (record) =>
          record.id !== currentRecord.id && record.username === payload.username
      )
    ) {
      throw httpError(409, "Ya existe un registro con ese username");
    }

    const updatedRecord = await db.update("login", req.params.id, payload);
    res.json(sanitizeLogin(updatedRecord));
  } catch (error) {
    next(error);
  }
}

async function deleteLogin(req, res, next) {
  try {
    const deletedRecord = await db.remove("login", req.params.id);

    if (!deletedRecord) {
      throw httpError(404, "Registro de login no encontrado");
    }

    res.json({
      message: "Registro de login eliminado",
      data: sanitizeLogin(deletedRecord),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createLogin,
  deleteLogin,
  getLoginById,
  getLogins,
  updateLogin,
};
