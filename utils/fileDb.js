const fs = require("fs/promises");
const path = require("path");

const DEFAULT_DB = {
  users: [],
  login: [],
};

function getDbPath() {
  if (process.env.DATA_FILE) {
    return path.resolve(process.cwd(), process.env.DATA_FILE);
  }

  return path.join(__dirname, "..", "data", "database.json");
}

async function ensureDbFile() {
  const dbPath = getDbPath();
  await fs.mkdir(path.dirname(dbPath), { recursive: true });

  try {
    await fs.access(dbPath);
  } catch (error) {
    await fs.writeFile(dbPath, JSON.stringify(DEFAULT_DB, null, 2));
  }

  return dbPath;
}

async function readDb() {
  const dbPath = await ensureDbFile();
  const raw = await fs.readFile(dbPath, "utf8");
  const parsed = raw ? JSON.parse(raw) : {};

  return {
    ...DEFAULT_DB,
    ...parsed,
  };
}

async function writeDb(data) {
  const dbPath = await ensureDbFile();
  await fs.writeFile(dbPath, `${JSON.stringify(data, null, 2)}\n`);
}

function getCollection(db, resource) {
  if (!Object.prototype.hasOwnProperty.call(DEFAULT_DB, resource)) {
    throw new Error(`Coleccion no soportada: ${resource}`);
  }

  if (!Array.isArray(db[resource])) {
    db[resource] = [];
  }

  return db[resource];
}

function getNextId(collection) {
  return (
    collection.reduce((maxId, item) => {
      const currentId = Number(item.id) || 0;
      return Math.max(maxId, currentId);
    }, 0) + 1
  );
}

async function list(resource) {
  const db = await readDb();
  const collection = getCollection(db, resource);
  return collection;
}

async function findById(resource, id) {
  const collection = await list(resource);
  return collection.find((item) => item.id === Number(id)) || null;
}

async function create(resource, payload) {
  const db = await readDb();
  const collection = getCollection(db, resource);
  const now = new Date().toISOString();
  const record = {
    id: getNextId(collection),
    ...payload,
    createdAt: now,
    updatedAt: now,
  };

  collection.push(record);
  await writeDb(db);
  return record;
}

async function update(resource, id, payload) {
  const db = await readDb();
  const collection = getCollection(db, resource);
  const recordIndex = collection.findIndex((item) => item.id === Number(id));

  if (recordIndex === -1) {
    return null;
  }

  const updatedRecord = {
    ...collection[recordIndex],
    ...payload,
    id: collection[recordIndex].id,
    updatedAt: new Date().toISOString(),
  };

  collection[recordIndex] = updatedRecord;
  await writeDb(db);
  return updatedRecord;
}

async function remove(resource, id) {
  const db = await readDb();
  const collection = getCollection(db, resource);
  const recordIndex = collection.findIndex((item) => item.id === Number(id));

  if (recordIndex === -1) {
    return null;
  }

  const [deletedRecord] = collection.splice(recordIndex, 1);
  await writeDb(db);
  return deletedRecord;
}

module.exports = {
  create,
  findById,
  list,
  remove,
  update,
};
