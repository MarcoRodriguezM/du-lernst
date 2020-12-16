// Importar los módulos requeridos
const mongoose = require("mongoose");
const Curso = mongoose.model("Curso");
const Categoria = mongoose.model("Categoria");
//const Carrito = mongoose.model("Carrito");
const { validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");
const slug = require("slug");
const authController = require("../controllers/authController");

//const year = new Date().getFullYear();

exports.explorarCursos = async (req, res, next) => {
  // Obtener todos los productos disponibles
  const cursos = await Curso.find().lean();
  const categorias = await Categoria.find().lean();

  res.render("explorarCursos", { cursos, categorias,
    login: req.isAuthenticated(), 
    usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null });
};

exports.buscar = async (req, res, next) => {
  const { categoria_id } = req.params;
  // Obtener todos los productos disponibles
  const cursos = await Curso.find().where({categoria:categoria_id}).lean();
  const categorias = await Categoria.find().lean();

  res.render("buscar", { cursos, categorias,
    login: req.isAuthenticated(), 
    usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null });
};

exports.misCursos = async (req, res, next) => {
  const { user_id } = req.params;
  const cursos = await Curso.find().where({owner: user_id}).lean();

  res.render("misCursos", { cursos,
    login: req.isAuthenticated(), 
    usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null });
};

// Mostrar el formulario de creación de producto
exports.formularioCrearCurso = async (req, res, next) => {
  const categorias = await Categoria.find().lean();

  res.render("crearCurso", { categorias, login: req.isAuthenticated(), 
    usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null});
};

// Crear un curso
exports.crearCurso = async (req, res, next) => {
  // Verificar que no existen errores de validación
  const errores = validationResult(req);
  const messages = [];

  // Si hay errores
  if (!errores.isEmpty()) {
    errores.array().map((error) => {
      messages.push({ message: error.msg, alertType: "danger" });
    });

    // Enviar los errores a través de flash messages
    req.flash("messages", messages);

    res.redirect("/crear-curso");
  } else {
    // Almacenar los valores del curso
    try {
      const { nombre, descripcion, precio, categoria } = req.body;

      await Curso.create({
        nombre,
        descripcion,
        precio,
        imagen: req.file.filename,
        owner: req.user._id,
        categoria,
      });

      messages.push({
        message: "Curso agregado correctamente!",
        alertType: "success",
      });
      req.flash("messages", messages);

      res.redirect("/crear-curso");
    } catch (error) {
      console.log(error);
      messages.push({
        message: error,
        alertType: "danger",
      });
      req.flash("messages", messages);
      res.redirect("/crear-curso");
    }
  }
};

// Permite subir un archivo (imagen) al servidor
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
      res.redirect("/crear-curso");
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
      cb(null, `${__dirname}../../public/uploads/cursos`);
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

// Muestra un producto que se obtiene a través de su URL
exports.verCurso = async (req, res, next) => {
  // Utilizar la opción populate para obtener información sobre un Object_ID
  const curso = await Curso.findOne({ url: req.params.url })
    .populate("owner")
    .lean();

  // Buscar productos en el carrito de compras si existen
  //const carrito = await Carrito.findOne({ usuario: req.user._id });

  if (!curso) res.redirect("/");
  else {
    res.render("mostrarCursos", {
      curso: curso,
      //productosCarrito: carrito ? carrito.producto.length : 0,
    });
  }
};

exports.eliminarCurso = async (req, res, next) => {
  
  const { id } = req.params;

  const curso = await Curso.findById(id);

  if (curso) {
    
    curso.remove();
    res.status(200).send("El curso ha sido eliminado correctamente");
  } else {
    
    console.log(error);
    res.status(403).send("Error al momento de eliminar el curso");
  }
};

// Función que sube el archivo
const upload = multer(configuracionMulter).single("imagen");

// Agrega productos al carrito de compras
/*exports.agregarProductoCarrito = async (req, res, next) => {
  try {
    // Obtener el producto a través del URL
    const { url } = req.params;

    const producto = await Producto.findOne({ url });

    // Buscar si el usuario ya tiene un carrito existente
    const carrito = await Carrito.findOne({ usuario: req.user._id });

    console.log(carrito);

    // Si el carrito no existe
    if (!carrito) {
      // Crear el arreglo de productos
      const productos = [];
      productos.push(producto);

      const nuevoCarrito = new Carrito({
        producto: productos,
        usuario: req.user._id,
        fecha: Date.now(),
        total: producto.precio,
      });

      // Almacenar el carrito
      await nuevoCarrito.save();

      req.flash("messages", [
        {
          message: "Producto agregado a tu carrito de compras",
          alertType: "success",
        },
      ]);

      // Redireccionar
      res.redirect("/");
    }

    // Ya existe un carrito almacenado para el usuario
    carrito.producto.push(producto);

    // Actualizar el total del carrito
    carrito.total += producto.precio;

    // Almacenar el nuevo producto
    await carrito.save();

    req.flash("messages", [
      {
        message: "Producto agregado a tu carrito de compras",
        alertType: "success",
      },
    ]);

    res.redirect("/");
  } catch (error) {
    // console.log(error);
  }
};*/