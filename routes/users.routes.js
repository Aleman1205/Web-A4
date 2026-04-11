const router = require("express").Router();
const {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} = require("../controllers/users.controllers.js");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
