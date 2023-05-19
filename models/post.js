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
    mainModel: model("main", postSchema),
    videoModel: model("video", postSchema),
    memesModel: model("memes", postSchema),
    animeModel: model("anime", postSchema)
}
