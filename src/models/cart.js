const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products' // This tells Mongoose which collection this ObjectId refers to. Like a foreign key
    },
    stock: Number
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;