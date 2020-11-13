// Importar los módulos requeridos
const passport = require("passport");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Usuario = mongoose.model("Usuarios");
const enviarCorreo = require("../handlers/email");
const { send } = require("process");

// Se encarga de autenticar el usuario y de redireccionarlo
exports.autenticarUsuario = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/iniciar-sesion",
    failureFlash: true,
    badRequestMessage: ["Debes ingresar tus credenciales"],
  });