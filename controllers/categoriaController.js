
const mongoose = require("mongoose");
const Categorias = mongoose.model("Categoria");
var cat = [];

exports.mostrar = function () {
  
    Categorias.find({},{nombre:1, _id:0}).lean().exec((err, categorias) => {

        categorias.forEach(function (doc,err) {
            cat.push(doc);
        }, function() {});
        console.log(cat);
    });

    
    
};