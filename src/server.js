const express = require('express');
const cors = require('cors');
const Products = require('./models/products');
const Cart = require('./models/cart');
const bodyParser = require('body-parser');

// Initializations
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Settings
app.set('port', process.env.PORT || 4000); // if the port variable exists in the env use it and if not, use port 4000

// Routes

// Route for get all the products
app.get('/products', async (req, res) => {
  try {
    const productos = await Products.find(); // Find all the products on the db
    res.json(productos); // Send all in json 

  } catch (error) {
    console.error(error);
     res.status(500).json({ message: 'The products could not be obtained', error });
  }
});

app.post('/createProduct', (req, res) => {
  try {
    const newProduct = Products(req.body);
    newProduct.save();
    res.status(200).json({ message: "the product was created successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Product could not be created', error });
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
    res.status(500).json({ message: 'The products could not be obtained', error });
  }
}); 


app.post('/cart', async (req, res) => {
  try {
    // Verify if the product is alredy in the cart
    const existingProduct = await Cart.findOne({ id: req.body.id });

    if (existingProduct) {
      return res.status(400).json({ message: "The product is already in the cart" });
    }

    // Reduce 1 from the stock 
    const updatedStock = req.body.stock - 1;
    await Products.updateOne({ _id: req.body.id }, { stock: updatedStock });

    const newProductCart = new Cart({
      'id': req.body.id,
      'stock': updatedStock
    });

    await newProductCart.save();
    console.log(newProductCart)
    res.status(200).json({ message: "Product successfully added" });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'The product could not be added to the cart', error });
  }
});

app.delete('/cart/:id', async (req, res) => {
  const cartItemId = req.params.id;
  const productId = req.query.id_product;
  console.log(productId)

  try {
    const deletedItem = await Cart.findByIdAndDelete(cartItemId);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    await Products.updateOne({ _id: req.query.id_product }, { $inc: { stock: 1 } })
    res.json({ message: 'Cart item successfully deleted', deletedItem });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Could not remove item from cart', error });
  }
})

module.exports = app;