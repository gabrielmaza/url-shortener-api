const User = require("../models/User");
const { validationResult } = require("express-validator");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
require("dotenv").config();

const registerForm = (req, res) => {
  res.render("register");
};

const loginForm = (req, res) => {
  res.render("login");
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/register");
  }
  const { userName, email, password } = req.body;
  try {
    // let user = await User.findOne({ userName: userName, email: email });
    // if (user) throw new Error("Ya existe el usuario");

    const existingUser = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (existingUser) {
      const errorMessages = [];
      if (existingUser.userName === userName) {
        errorMessages.push({ msg: "El nombre de usuario ya está en uso" });
      }
      if (existingUser.email === email) {
        errorMessages.push({
          msg: "La dirección de correo electrónico ya está en uso",
        });
      }
      req.flash("mensajes", errorMessages);
      return res.redirect("/auth/register");
    }

    user = new User({ userName, email, password, tokenConfirm: nanoid() });
    await user.save();

    // Enviar correo electronico
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.userEmail,
        pass: process.env.passEmail,
      },
    });
    await transport.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: user.email, // list of receivers
      subject: "Verifica tu cuenta de correo ✔", // Subject line
      html: `<a href="http://localhost:5000/auth/confirmar/${user.tokenConfirm}"><h1>Verifica tu correo haciendo clic aquí.</h1></a> `, // html body
    });
    req.flash("mensajes", [
      { msg: "Revisa tu correo electrónico y valida tu cuenta" },
    ]);
    return res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/register");
  }
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) throw new Error("No existe este usuario");

    user.confirmedAccount = true;
    user.tokenConfirm = null;

    await user.save();

    req.flash("mensajes", [
      { msg: "¡Cuenta verificada! Puedes iniciar sesión." },
    ]);
    return res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("auth/login");
    // res.json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/login");
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("No existe el usuario");
    if (!user.confirmedAccount) throw new Error("Falta confirmar cuenta");
    if (!(await user.comparePassword(password)))
      throw new Error("Contraseña incorrecta");

    // Crear sesión a travez de passport
    req.login(user, (err) => {
      if (err) throw new Error("Error al iniciar sesión");
      return res.redirect("/");
    });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};

const closeSession = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "No se puede cerrar la sesión" });
    }
    res.redirect("/auth/login");
  });
};

module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmAccount,
  loginUser,
  closeSession,
};
