const express = require('express');
const Products = require('./models/products');
const Cart = require('./models/cart');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initializations
const app = express();

app.use(cors())
//para el post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Settings
app.set('port', process.env.PORT || 4000); // if the port variable exists in the env use it and if not, use port 4000

// Routes
app.get('/', (req, res) => {
    res.send('hello world');
});

// Route for get all the products
app.get('/products', async (req, res) => {
  try {
    const productos = await Products.find(); // Find all the products on the db
    res.json(productos); // Send all in json 
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: 'No se han podido obtener los productos', error });
  }
});

app.post('/createProduct', (req, res) => {
  try {
    const newProduct = Products(req.body);
    newProduct.save();
    res.status(200).json({ message: "Se insertó correctamente"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se ha podido crear el producto', error });
  } 
})

// Route for get all the cart items
app.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.find(); // Find all the cart products on the db
    res.json(cart); // Send all in json 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se han podido obtener los productos', error });
  }
});

app.post('/cart', async (req, res) => {
  try {
    const newProductCart = new Cart({
      'id': req.body.id,
      'stock': req.body.stock
    });
    await newProductCart.save();
    console.log(newProductCart)
    res.status(200).json({ message: "Se insertó correctamente al carrito" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'No se ha podido crear el producto', error });
  }
});

module.exports = app;