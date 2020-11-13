// Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const { validationResult } = require("express-validator");

const year = new Date().getFullYear();

// Cargar el formulario de la creación de una cuenta de usuario
exports.formularioCrearCuenta = (req, res, next) => {
  res.render("registrarse", {
    layout: "main",
    typePage: "register-page",
    signButtonValue: "/iniciar-sesion",
    signButtonText: "Iniciar sesión",
    year,
  });
};