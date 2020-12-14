
const mongoose = require("mongoose");
const Categoria = mongoose.model("Categoria");
const { validationResult } = require("express-validator");
const authController = require("../controllers/authController");

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
    console.log(categorias);
    return categorias;
  };

  // Mostrar el formulario de creación de categorias
exports.formularioCrearCategoria = (req, res, next) => {
    res.render("crearCategoria", {login: req.isAuthenticated(), 
      usuario: req.isAuthenticated() ? authController.usuarioInfo(req) : null});
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
  
      res.redirect("/error");
    } else {
      
      try {
        const { nombre, descripcion } = req.body;
  
        await Categoria.create({
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