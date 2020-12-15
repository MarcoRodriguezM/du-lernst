// Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const { validationResult } = require("express-validator");
const authController = require("../controllers/authController");
const multer = require("multer");
const shortid = require("shortid");
const slug = require("slug");

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

// Procesar el formulario de creación de cuenta
exports.crearCuenta = async (req, res, next) => {
    // Verificar que no existan errores de validación
    const errores = validationResult(req);
    const messages = [];
    // Obtener las variables desde el cuerpo de la petición
    const { nombre, email, password } = req.body;
  
    // Si hay errores
    if (!errores.isEmpty()) {
      // Utilizar la función map para navegar dentro de un arreglo
      errores
        .array()
        .map((error) =>
          messages.push({ message: error.msg, alertType: "danger" })
        );
  
      // Agregar los errores a nuestro mensajes flash
      req.flash("messages", messages);
  
      res.redirect("/crear-cuenta");
    } else {
      // Intentar almacenar los datos del usuario
      try {
        // Crear el usuario
        // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Promise
        // https://developer.mozilla.org/es/docs/Learn/JavaScript/Asynchronous/Async_await
        await Usuario.create({
          email,
          password,
          nombre,
          rol: "Cursilista"
        });
  
        // Mostrar un mensaje
        messages.push({
          message: "!Usuario creado satisfactoriamente!",
          alertType: "success",
        });
        req.flash("messages", messages);
  
        res.redirect("/iniciar-sesion");
      } catch (error) {
        messages.push({
          message: error,
          alertType: "danger",
        });
        req.flash("messages", messages);
        res.redirect("/crear-cuenta");
      }
    }
  };
  exports.formularioIniciarSesion = (req, res, next) => {
    console.log(req.flash());
    res.render("iniciarSesion", {
      // layout: "auth",
      typePage: "login-page",
      signButtonValue: "/crear-cuenta",
      signButtonText: "Regístrate",
      year,
    });
  };

  exports.verPerfilUsuario = async (req, res, next) => {
    const usuario = authController.usuarioInfo(req);
    
    res.render("perfil", { login: req.isAuthenticated(), 
      usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null });
  };

  exports.actualizarPerfil = async (req, res, next) => {
    const mensajes = [];
    const usuario = authController.usuarioInfo(req);
    const email = req.user.email;
    const { nombre } = req.body;
   
      try {
        const user = await Usuario.findOne({email});
        if (req.file.filename) {
          user.imagen = req.file.filename;
        }
        user.nombre = nombre;
        user.email = email;
        
        await user.save();
        mensajes.push({
          mensaje:
            "La informacion se ha actualizado exitosamente, es necesario que cierres tu sesion y vuelvas a iniciar",
          type: "alert-success",
        });
        res.redirect("/perfil");
      } catch (error) {
        mensajes.push({
          mensaje: "Ha ocurrido un erro al momento de actualizar la informacion.",
          type: "alert-danger",
        });
        res.redirect("/perfil");
      }
    
  };

  exports.subirImagen = (req, res, next) => {
    
    upload(req, res, function (error) {
      console.log(req.body);
      if (error) {
        // Errores de Multer
        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            req.flash("messages", [
              {
                message:
                  "El tamaño del archivo es superior al límite. Máximo 100Mb",
                alertType: "danger",
              },
            ]);
          } else {
            req.flash("messages", [
              { message: error.message, alertType: "danger" },
            ]);
          }
        } else {
          // Errores creado por el usuario
          req.flash("messages", [
            { message: error.message, alertType: "danger" },
          ]);
        }
        // Redireccionar y mostrar el error
        res.redirect("/perfil");
        return;
      } else {
        // Archivo cargado correctamente
        return next();
      }
    });
    // }
  };
  
  // Opciones de configuración para multer en productos
  const configuracionMulter = {
    // Tamaño máximo del archivo en bytes
    limits: {
      fileSize: 100000000,
    },
    // Dónde se almacena el archivo
    storage: (fileStorage = multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, `${__dirname}../../public/uploads/perfil`);
      },
      filename: (req, file, cb) => {
        // Construir el nombre del archivo
        // iphone.png --> image/png --> ["image", "png"]
        // iphone.jpg --> image/jpeg
        const extension = file.mimetype.split("/")[1];
        cb(null, `${shortid.generate()}.${extension}`);
      },
    })),
    // Verificar el tipo de archivo mediante el mime type
    // https://developer.mozilla.org/es/docs/Web/HTTP/Basics_of_HTTP/MIME_types
    fileFilter(req, file, cb) {
      if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        // Si el callback retorne true se acepta el tipo de archivo
        cb(null, true);
      } else {
        cb(
          new Error(
            "Formato de archivo no válido. Solamente se permniten JPEG/JPG o PNG"
          ),
          false
        );
      }
    },
  };
  const upload = multer(configuracionMulter).single("imagen");  
        
  