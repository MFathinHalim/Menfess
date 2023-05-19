const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

const uri = process.env.MONGODBURI;
const port = 3000;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Increase the server selection timeout
})
  .then(() => {
    console.log('Connected to the database');
    app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
