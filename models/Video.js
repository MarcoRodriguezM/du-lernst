// Importar los módulos requeridos
const mongoose = require("mongoose");
const shortid = require("shortid");
const slug = require("slug");

// Definición del schema
const videoSchema = new mongoose.Schema({
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
  video: String,
  url: {
    type: String,
    lowercase: true,
  },
  curso: {
    type: mongoose.Schema.ObjectId,
    ref: "Curso",
    required: true,
  },
});
// Hooks para generar la URL de la categoria
videoSchema.pre("save", function (next) {
  // Crear la URL
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

// Generar un índice para mejorar la búsqueda por el nombre de la categoria
videoSchema.index({ nombre: "text" });

module.exports = mongoose.model("Video", videoSchema);