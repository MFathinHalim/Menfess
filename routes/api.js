const { Router } = require("express")
const PostRouter = require("./api/post")

// Import model2 nya
const { mainModel, animeModel, memesModel } = require("../models/post")

// Bikin router buat masing2 api post nya
const mainApiRouter = new PostRouter(mainModel, "main").getRouter()
const animeApiRouter = new PostRouter(animeModel, "anime").getRouter()
const memesApiRouter = new PostRouter(memesModel, "memes").getRouter()

// Bikin router buat api nya
const app = Router()

// Ywdh sih tinggal diginiin doang
app.use("/main", mainApiRouter)
app.use("/anime", animeApiRouter)
app.use("/memes", memesApiRouter)

module.exports = app
