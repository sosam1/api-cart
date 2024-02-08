const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/tiendaOnline';

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

    .then(db => console.log("Database is connected"))
    .catch(err => console.log('Error al conectar a MongoDB:', err))

