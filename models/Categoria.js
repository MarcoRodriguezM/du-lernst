// Importar los módulos requeridos
const mongoose = require("mongoose");
const shortid = require("shortid");

// Definición del schema
const categoriaSchema = new mongoose.Schema({
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
});
// Hooks para generar la URL de la categoria
categoriaSchema.pre("save", function (next) {
  // Crear la URL
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

// Generar un índice para mejorar la búsqueda por el nombre de la categoria
categoriaSchema.index({ nombre: "text" });

module.exports = mongoose.model("Categoria", categoriaSchema);