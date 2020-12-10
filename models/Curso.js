// Importar los módulos requeridos
const mongoose = require("mongoose");
const shortid = require("shortid");

// Definición del schema
const cursoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  imagen: String,
  url: {
    type: String,
    lowercase: true,
  },
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: "Usuarios",
    required: true,
  },
  /*categoria: {
    type: mongoose.Schema.ObjectId,
    ref: "Categoria",
    required: true,
  },*/
});
// Hooks para generar la URL de la categoria
cursoSchema.pre("save", function (next) {
  // Crear la URL
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

// Generar un índice para mejorar la búsqueda por el nombre de la categoria
cursoSchema.index({ nombre: "text" });

module.exports = mongoose.model("Curso", cursoSchema);