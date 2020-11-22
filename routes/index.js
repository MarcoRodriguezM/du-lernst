// Importar los módulos requeridos
const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");
const categoriaController = require("../controllers/categoriaController");
const { check } = require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
  // Rutas disponibles
  router.get("/", (req, res, next) => {
    res.render("home");
  });

  router.get("/categorias", (req, res, next) => {
    res.render("categorias");
  });
  router.get("/videostutorias", (req, res, next) => {
    res.render("videostutorias");
  });
  
  router.get("/videoscategoria", (req, res, next) => {
    res.render("videoscategoria");
  });

  router.get("/Asociarse", (req, res, next) => {
    res.render("formularioAsoci");
  });

  router.get("/informacion", (req, res, next) => {
    res.render("informacion");
  });


  router.get("/tutorias", (req, res, next) => {
    res.render("Tutorias");
  });

  

  router.post("/categorias", (req, res, next) => {
  
    const categorias = categoriaController.mostrar();
  
    res.render("categorias", { categorias });
  });

  // Rutas para usuario
  router.get("/crear-cuenta", usuarioController.formularioCrearCuenta);

  router.post(
    "/crear-cuenta",
    [
      // Realizar una verificación de los atributos del formulario
      // https://express-validator.github.io/docs/index.html
      check("nombre", "Debes ingresar tu nombre completo.")
        .not()
        .isEmpty()
        .escape(),
      check("email", "Debes ingresar un correo electrónico.").not().isEmpty(),
      check("email", "El correo electrónico ingresado no es válido.")
        .isEmail()
        .normalizeEmail(),
      check("password", "Debes ingresar una contraseña").not().isEmpty(),
    ],
    usuarioController.crearCuenta
  );

  router.get("/iniciar-sesion", usuarioController.formularioIniciarSesion);

  router.post("/iniciar-sesion", authController.autenticarUsuario);

  router.get("/olvide-password", authController.formularioRestablecerPassword);

  router.post("/olvide-password", authController.enviarToken);

  router.get("/olvide-password/:token", authController.formularioNuevoPassword);

  router.post("/olvide-password/:token", authController.almacenarNuevaPassword);

  router.post("/categorias", categoriaController.mostrar);

  // Rutas de administración
  router.get("/administrar", (req, res, next) => {
    res.send("Administración del sitio");
  });

  return router;
};