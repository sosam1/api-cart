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

// Route for get all the cart items with a $lookup search that brings all the product data in the
// product_info field

app.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.aggregate(
      [
        {
          $lookup: {
            from: 'products',
            localField: 'id',
            foreignField: '_id',
            as: 'product_info'
          }
        }
      ]);
    res.json(cart)
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

app.delete('/cart/:id', async (req, res) => {
  const cartItemId = req.params.id;
  try {
    const deletedItem = await Cart.findByIdAndDelete(cartItemId);
    if (!deletedItem) {
      return res.status(404).json({ message: 'El elemento del carrito no se encontró' });
    }
    res.json({ message: 'Elemento del carrito eliminado con éxito', deletedItem });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'No se ha podido eliminar el item del carrito', error });
  }

})

module.exports = app;