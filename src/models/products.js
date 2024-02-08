const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    marca: String,
    modelo: String,
    precio: Number,
    stock: Number
});

const Products = mongoose.model('Products', productoSchema);

module.exports = Products;