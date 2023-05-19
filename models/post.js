const { Schema, model } = require("mongoose");

const postSchema = new Schema({
    noteId: String,
    noteName: String,
    noteContent: String,
    like: {
        type: Number,
        default: 0
    },
    color: String,
    comment: [{
        commentId: String,
        commenterName: String,
        commentContent: String
    }],
})


module.exports = {
    mainModel: model("mains", postSchema),
    videoModel: model("videos", postSchema),
    memesModel: model("memes", postSchema),
    animeModel: model("animes", postSchema)
}
