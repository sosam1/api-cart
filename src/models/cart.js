const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id: String,
    stock: Number
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;