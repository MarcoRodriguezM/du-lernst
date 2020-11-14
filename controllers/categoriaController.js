
const mongoose = require("mongoose");
const Categorias = mongoose.model("Categoria");

exports.mostrar = function () {
  
    Categorias.find({},{nombre:1, _id:0}).lean().exec((err, categorias) => {

          return categorias;
          
    });
};