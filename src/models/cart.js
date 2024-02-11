const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products' // Esto indica a Mongoose a qué colección hace referencia este ObjectId
    },
    stock: Number
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;