const router = require("express").Router();
const {
  home,
  marco,
  ping,
} = require("../controllers/index.controllers.js");

router.get("/", home);
router.get("/marco", marco);
router.get("/ping", ping);

module.exports = router;
