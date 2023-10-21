const express = require("express");
const { body } = require("express-validator");

const {
  loginForm,
  registerForm,
  registerUser,
  confirmAccount,
  loginUser,
  closeSession,
} = require("../controllers/authController");
const router = express.Router();

router.get("/register", registerForm);
router.post(
  "/register",
  [
    body("userName", "Ingrese un nombre válido").trim().notEmpty().escape(),
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese un mínimo de 6 caracteres")
      .trim()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("No coinciden las contraseñas");
        } else {
          return value;
        }
      }),
  ],
  registerUser
);
router.get("/confirmar/:token", confirmAccount);
router.get("/login", loginForm);
router.post(
  "/login",
  [
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese un mínimo de 6 caracteres")
      .trim()
      .isLength({ min: 6 })
      .escape(),
  ],
  loginUser
);
router.get("/logout", closeSession);

module.exports = router;
