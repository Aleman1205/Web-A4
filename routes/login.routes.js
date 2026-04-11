const router = require("express").Router();
const {
  createLogin,
  deleteLogin,
  getLoginById,
  getLogins,
  updateLogin,
} = require("../controllers/login.controllers.js");

router.post("/", createLogin);
router.get("/", getLogins);
router.get("/:id", getLoginById);
router.put("/:id", updateLogin);
router.delete("/:id", deleteLogin);

module.exports = router;
