const { Router } = require("express")

// Import controller
const PostController = require("../../controllers/post")

// Import config an multer yg sgt sederhana. g percaya? liat sendiri isi file ny
const multer = require("../../tools/multer")

class PostRouter {
  // Ini private field
  #app
  #controller

  // Ini constructor
  constructor(model, type) {
    // Bikin router nya
    this.#app = Router()

    // inisialisasi controller nya
    this.#controller = new PostController(model, type)

    // Ywdh sih tinggal diginiin doang
    this.#app.get("/posts", (req, res) => this.#controller.getPosts(req, res))
    this.#app.get("/post/:id", (req, res) => this.#controller.getPost(req, res))
    this.#app.post("/post", multer.single("image"), (req, res) => this.#controller.createPost(req, res))
    this.#app.post("/like/:id", (req, res) => this.#controller.like(req, res))
    this.#app.post("/comment/:id", (req, res) => this.#controller.comment(req, res))
  }

  getRouter() {
    return this.#app
  }
}

module.exports = PostRouter
