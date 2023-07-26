const Multer = require("multer");

const storage = Multer.memoryStorage()

const multer = Multer({ storage })

module.exports = multer
