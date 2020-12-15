
const mongoose = require("mongoose");
const Categoria = mongoose.model("Categoria");
const { validationResult } = require("express-validator");
const authController = require("../controllers/authController");
const multer = require("multer");
const shortid = require("shortid");

exports.mostrarCategorias = async (req, res, next) => {
    const categorias = await Categoria.find().lean();
  
    res.render("categoriasVer", { categorias, 
      login: req.isAuthenticated(), 
      usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null });
  };

exports.enlistarCategorias = async (req, res, next) => {
  const categorias = [];
    const cat_id = await Categoria.find({}, {_id:1}).lean();
    const catNombre = await Categoria.find({}, {_id:0, nombre:1}).lean();

    cat_id.forEach(_id => {
      categorias.push({
        _id
      });
    });
    return categorias;
  };

  // Mostrar el formulario de creación de categorias
exports.formularioCrearCategoria = async (req, res, next) => {
  const categorias = await Categoria.find().lean();

    res.render("crearCategoria", { categorias,
      login: req.isAuthenticated(), 
      usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null});
  };
  
  // Crear una categoria
  exports.crearCategoria = async (req, res, next) => {
    // Verificar que no existen errores de validación
    const errores = validationResult(req);
    const messages = [];
    console.log(req.body);
    // Si hay errores
    if (!errores.isEmpty()) {
      errores.array().map((error) => {
        messages.push({ message: error.msg, alertType: "danger" });
      });
  
      // Enviar los errores a través de flash messages
      req.flash("messages", messages);
  
      res.redirect("/error");
    } else {
      
      try {
        const { nombre, descripcion } = req.body;
  
        await Categoria.create({
          nombre,
          descripcion,
          imagen: req.file.filename
        });
  
        messages.push({
          message: "Categoría agregada correctamente!",
          alertType: "success",
        });
        req.flash("messages", messages);
  
        res.redirect("/crear-categoria");
      } catch (error) {
        console.log(error);
        messages.push({
          message: error,
          alertType: "danger",
        });
        req.flash("messages", messages);
        res.redirect("/crear-categoria");
      }
    }
  };

  exports.subirImagen = (req, res, next) => {
  
    upload(req, res, function (error) {
      if (error) {
        // Errores de Multer
        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            req.flash("messages", [
              {
                message:
                  "El tamaño del archivo es superior al límite. Máximo 300Kb",
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
        res.redirect("/crear-categoria");
        return;
      } else {
        // Archivo cargado correctamente
        return next();
      }
    });
    // }
  };

  const configuracionMulter = {
    // Tamaño máximo del archivo en bytes
    limits: {
      fileSize: 100000000,
    },
    // Dónde se almacena el archivo
    storage: (fileStorage = multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, `${__dirname}../../public/uploads/categorias`);
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