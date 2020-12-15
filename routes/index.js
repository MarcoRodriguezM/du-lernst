// Importar los módulos requeridos
const express = require("express");
const mongoose = require("mongoose");
const Categoria = mongoose.model("Categoria");
const usuarioController = require("../controllers/usuarioController");
const VideoController = require("../controllers/VideoController");
const authController = require("../controllers/authController");
const cursosController = require("../controllers/cursosController");
const categoriaController = require("../controllers/categoriaController");
const { check }= require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
  // Rutas disponibles
  router.get("/", async (req, res, next) => {
    const categorias = await Categoria.find().lean();

     res.render("home", 
     { login: req.isAuthenticated(), 
      usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null, 
      categorias: categorias
    });
  });

  // Rutas para categorias
  router.get("/categorias", categoriaController.mostrarCategorias);

  router.get(
    "/crear-categoria",
    authController.verificarInicioSesion,
    categoriaController.formularioCrearCategoria
  );

  router.post(
    "/crear-categoria",
    authController.verificarInicioSesion,
    // [
    //   check("imagen", "Debes seleccionar una imagen para el producto")
    //     .not()
    //     .isEmpty(),
    // ],
    //categoriaController.subirImagen,
    [
      check("nombre", "Debes ingresar el nombre de la categoria")
        .not()
        .isEmpty()
        .escape(),
      check("descripcion", "Debes ingresar la descripción de la categoria")
        .not()
        .isEmpty()
        .escape(),
    ],
    categoriaController.crearCategoria
  );

  router.get("/explorarCursos", cursosController.explorarCursos);

  // Rutas para cursos
  router.get(
    "/crear-curso",
    authController.verificarInicioSesion,
    cursosController.formularioCrearCurso
  );

  router.post(
    "/crear-curso",
    authController.verificarInicioSesion,
    // [
    //   check("imagen", "Debes seleccionar una imagen para el producto")
    //     .not()
    //     .isEmpty(),
    // ],
    cursosController.subirImagen,
    [
      check("nombre", "Debes ingresar el nombre del curso")
        .not()
        .isEmpty()
        .escape(),
      check("descripcion", "Debes ingresar la descripción del curso")
        .not()
        .isEmpty()
        .escape(),
    ],
    cursosController.crearCurso
  );

//Rutas Videos
  router.get("/videostutorias", (req, res, next) => {
    res.render("videostutorias");
  });
  
  router.get("/videoscategoria", (req, res, next) => {
    res.render("videoscategoria");
  });

  // Rutas para cursos
  router.get(
    "/crear-curso",
    authController.verificarInicioSesion,
    cursosController.formularioCrearCurso
  );

  router.post(
    "/crear-curso",
    authController.verificarInicioSesion,
    // [
    //   check("imagen", "Debes seleccionar una imagen para el producto")
    //     .not()
    //     .isEmpty(),
    // ],
    cursosController.subirImagen,
    [
      check("nombre", "Debes ingresar el nombre del curso")
        .not()
        .isEmpty()
        .escape(),
      check("descripcion", "Debes ingresar la descripción del curso")
        .not()
        .isEmpty()
        .escape(),
    ],
    cursosController.crearCurso
  );

  router.get("/Asociarse", async (req, res, next) => {
    const categorias = await Categoria.find().lean();
    res.render("formularioAsoci", { login: req.isAuthenticated(), 
      usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null, 
      categorias: categorias
    });
  });

  router.get("/informacion", async (req, res, next) => {
    const categorias = await Categoria.find().lean();
    res.render("informacion", { login: req.isAuthenticated(), 
      usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null, 
      categorias: categorias
    });

  });
  router.get("/ManualUsuario", async (req, res, next) => {
    const categorias = await Categoria.find().lean();
    res.render("ManualUsuario", { login: req.isAuthenticated(), 
      usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null, 
      categorias: categorias
    });
  });

  router.get(
    "/perfil",
    usuarioController.verPerfilUsuario
  );
  
  router.post(
    "/perfil",
    authController.verificarInicioSesion,
    check("nombre").not().isEmpty(),
    check("email").not().isEmpty(),

    usuarioController.subirImagen,

    
    usuarioController.actualizarPerfil
  );
  // Ver contenido de la leccion

// Rutas para videos
router.get(
  "/crear-video",
  authController.verificarInicioSesion,
  VideoController.formularioCrearVideo
);

router.post(
  "/crear-video",
  authController.verificarInicioSesion,
  // [
  //   check("imagen", "Debes seleccionar una imagen para el producto")
  //     .not()
  //     .isEmpty(),
  // ],
  VideoController.subirVideo,
  [
    check("nombre", "Debes ingresar el nombre del video")
      .not()
      .isEmpty()
      .escape(),
    check("descripcion", "Debes ingresar la descripción del video")
      .not()
      .isEmpty()
      .escape(),
  ],
  VideoController.crearVideo
);

  router.get("/enlistarVideos", VideoController.enlistarVideos);


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


  router.post("/FormularioInformacion", authController.enviarCorreo);

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
return router; 
};

