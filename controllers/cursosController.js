
const mongoose = require("mongoose");
const Categorias = mongoose.model("Categoria");

exports.mostrarCategorias = async (req, res, next) => {
    const cursos = await Categorias.find().lean();
  
    res.render("explorarCursos", { categorias: cursos });
  };

  // Mostrar el formulario de creación de categorias
exports.formularioCrearCategoria = (req, res, next) => {
    res.render("crearCategoria", {
      year,
    });
  };
  
  // Crear una categoria
  exports.crearCategoria = async (req, res, next) => {
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
  
      res.redirect("/crear-categoria");
    } else {
      
      try {
        const { nombre, descripcion } = req.body;
  
        await Producto.create({
          nombre,
          descripcion,
        });
  
        messages.push({
          message: "Categoria agregada correctamente!",
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