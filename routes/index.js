// Importar los módulos requeridos
const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const VideoController = require("../controllers/VideoController");
const authController = require("../controllers/authController");
const categoriaController = require("../controllers/categoriaController");
const { check } = require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
  // Rutas disponibles
  router.get("/", (req, res, next) => {

    var usuario;
    
    if (req.isAuthenticated) {
      usuario = authController.usuarioInfo(req);
    }

    res.render("home", { usuario });
  });


  router.get("/categorias", categoriaController.mostrarCategorias);

  router.get(
    "/crear-categoria",
    authController.verificarInicioSesion,
    categoriaController.formularioCrearCategoria
  );

  router.get("/cursos", (req, res, next) => {
    res.render("cursos");
  });

  router.get("/videostutorias", (req, res, next) => {
    res.render("videostutorias");
  });
  
  router.get("/videoscategoria", (req, res, next) => {
    res.render("videoscategoria");
  });

  router.get("/sidebar", (req, res, next) => {
    res.render("sidebar");
  });

  router.get("/Asociarse", (req, res, next) => {
    res.render("formularioAsoci");
  });

  router.get("/informacion", (req, res, next) => {
    res.render("informacion");

  });
  router.get("/ManualUsuario", (req, res, next) => {
    res.render("ManualUsuario");
  });




  router.get("/tutorias", (req, res, next) => {
    res.render("Tutorias");
  });


  router.get("/video", (req, res, next) => {
    res.render("Video");
  });

  router.get("/videos", (req, res, next) => {
    res.render("Videos");
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

  router.post("FormularioInformacion", (req, res, next) => {

    const { nombre,email,interes,Opinion,comentarios } = req.body;
  
     FormularioInformacion(nombre,email,interes,Opinion,comentarios);
  
    
  });
  

  router.get("/iniciar-sesion", usuarioController.formularioIniciarSesion);

  router.post("/iniciar-sesion", authController.autenticarUsuario);

  router.get("/salir",authController.cerrarSesion);

  router.get("/olvide-password", authController.formularioRestablecerPassword);

  router.post("/olvide-password", authController.enviarToken);

  router.get("/olvide-password/:token", authController.formularioNuevoPassword);

  router.post("/olvide-password/:token", authController.almacenarNuevaPassword);

  // Rutas de administración
  router.get("/administrar", (req, res, next) => {
    res.send("Administración del sitio");
  });


  // router.get(
  //   '/subir-videos',
  // authController.verificarInicioSesion,
  // VideoController.formulariovideo

  // );

  return router;
};