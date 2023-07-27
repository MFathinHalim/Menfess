const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  noteId: {
    type: String,
    required: true
  },
  noteName: {
    type: String,
    required: true
  },
  noteContent: {
    type: String,
    required: true
  },
  like: {
    type: Number,
    default: 0,
  },
  color: String,
  comment: [
    {
      commentId: String,
      commenterName: String,
      commentContent: String,
    },
  ],
});

module.exports = {
  mainModel: model("mains", postSchema),
  videoModel: model("videos", postSchema),
  memesModel: model("memes", postSchema),
  animeModel: model("animes", postSchema),
};
