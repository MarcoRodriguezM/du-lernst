// Módulos requeridos
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

// Configuración de Mongoose
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});