const mongoose = require('mongoose')
require("dotenv").config()

const app = require('./app')

app.listen(3000, (req, res) => {
  Host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    console.log("App is running on port 3000")
    mongoose.connect(process.env.MONGODBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
})