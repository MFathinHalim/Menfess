var app = require('./app.js').app

app.listen(3000, (req, res) => {
  Host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    console.log("App is running on port 3000")
})
