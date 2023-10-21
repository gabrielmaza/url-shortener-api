const express = require("express");
const {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redirection,
} = require("../controllers/homeController");
const urlValidator = require("../middlewares/urlValidator");
const userVerification = require("../middlewares/userVerification");

const router = express.Router();

router.get("/", userVerification, leerUrls);
router.post("/", userVerification, urlValidator, agregarUrl);
router.get("/editar/:id", userVerification, editarUrlForm);
router.post("/editar/:id", userVerification, urlValidator, editarUrl);
router.get("/eliminar/:id", userVerification, eliminarUrl);
router.get("/:shortURL", redirection);

module.exports = router;
