const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const bodyParser = require('body-parser');
// const route = require('./routes/vendorRoutes');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/home', (req, res) => {
  res.send('Hello from home route');
});

