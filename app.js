require("dotenv").config();

const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const indexRoutes = require("./routes/index.routes.js");
const loginRoutes = require("./routes/login.routes.js");
const usersRoutes = require("./routes/users.routes.js");
const errorHandler = require("./utils/errorHandler.js");
const httpError = require("./utils/httpError.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(indexRoutes);
app.use("/users", usersRoutes);
app.use("/login", loginRoutes);

app.use((req, res, next) => {
  next(httpError(404, "Ruta no encontrada"));
});

app.use(errorHandler);

module.exports = app;
