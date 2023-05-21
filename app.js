/*
  * *Hello, My name is M.Fathin Halim/Doma Tomoharu. This is code for my Application called "Menfess"! :D 
*/

//TODO First we will be import the package from "node_modules" folder.
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const fs = require('fs');
const multer = require('multer');
const fileupload = require('express-fileupload'); 
const FormData = require('form-data')
const { mainModel, videoModel, memesModel, animeModel } = require("./models/post")

// SDK initialization

var ImageKit = require("imagekit");

//TODO Make ImageKit
var imagekit = new ImageKit({
  publicKey : process.env.IMAGEKIT_PUBLICKEY,
  privateKey : process.env.IMAGEKIT_PRIVATEKEY,
  urlEndpoint : process.env.IMAGEKIT_URLENDPOINT
});

//? ===============================================

//TODO Now, we will make the storage with Multer:
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `public/images/uploads`)
  },
  filename: function(req, file, cb) {
    cb(null, `image-${data.length + 100}.jpg`)
  }
})

const storageVid = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `public/videos/`)
  },
  filename: function(req, file, cb) {
    cb(null, `video-${datavid.length + 100}.mp4`)
  }
})

const storageMemes = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `public/images/uploads/memes`)
  },
  filename: function(req, file, cb) {
    cb(null, `image-${dataMemes.length + 1}.jpg`)
  }
})

const storageAnime = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `public/images/uploads/anime`)
  },
  filename: function(req, file, cb) {
    cb(null, `image-${dataAnime.length + 1}.jpg`)
  }
})

//? ==================================================
//TODO Now will make the connection variable to connect from multer Storage
const upload = multer({ storage });
const uploadvid = multer({ storage: storageVid });
const uploadMemes = multer({ storage: storageMemes });
const uploadAnime = multer({ storage: storageAnime });

//? =================================================== 

//TODO Now will make the data list variable
var data = []; //* Main Data
var datavid = []; //* Video data
var dataMemes = [];
var dataAnime = [];

// intinya ngambil dari mongodb taruh variabel data
try{
  mainModel.find({}, null, { sort: { like: -1 } }).then(docs => data = docs)
  videoModel.find({}, null, { sort: { like: -1 } }).then(docs => datavid = docs)
  memesModel.find({}, null, { sort: { like: -1 } }).then(docs => dataMemes = docs)
  animeModel.find({}, null, { sort: { like: -1 } }).then(docs => dataAnime = docs)

}catch{
  try{
    mainModel.find({}, null, { sort: { like: -1 } }).then(docs => data = docs)
    videoModel.find({}, null, { sort: { like: -1 } }).then(docs => datavid = docs)
    memesModel.find({}, null, { sort: { like: -1 } }).then(docs => dataMemes = docs)
    animeModel.find({}, null, { sort: { like: -1 } }).then(docs => dataAnime = docs)
  
  }catch{
    mainModel.find({}, null, { sort: { like: -1 } }).then(docs => data = docs)
    videoModel.find({}, null, { sort: { like: -1 } }).then(docs => datavid = docs)
    memesModel.find({}, null, { sort: { like: -1 } }).then(docs => dataMemes = docs)
    animeModel.find({}, null, { sort: { like: -1 } }).then(docs => dataAnime = docs)
  }
}


//TODO Now times to make the app
const app = express()

//TODO Next we will be setup the app package, like EJS, cookies, path, and etc.
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

//TODO Finally, the hard one. We will be make the get function. We will be use pagination.
var shuf = true; //* for shuffle
var postCounter = 0;

//TODO function for shuffle on client, so dont change the main data
function shuffleOnClient(data) {

  return data;

}
//? ==============================================

//TODO Make class for application function
class Application {
  constructor(data, ejs, pageNumber, cookies) {
    this.data = data;
    this.ejs = ejs;
    this.pageNumber = pageNumber;
    this.cookies = cookies;
  }

  //TODO next make function for app.get()
  getFunction() {
    //TODO okay, in pagination we will be make the const variable first
    const currentPage = parseInt(this.pageNumber) || 1;
    const adjustedPage = currentPage - 1;
    const itemsPerPage = 10;
    const startIndex = adjustedPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = this.data.slice(startIndex, endIndex);

    /*
      * TODO then will make the paginated data and see if the note with the same noteId in loop has liked in cookies or not.
      for (let i = 0; i < paginatedData.length; i++) {
        const noteId = paginatedData[i].noteId;
        paginatedData.find((note) => note.noteId === noteId).hasLiked = req.cookies[`liked_${noteId}`] === "true";
    }*/

    //TODO this will be make the paginatedData will shuffle.
    var gg;
    gg = shuffleOnClient(paginatedData);

    if (postCounter % 2 === 0) {
      this.cookies.render(this.ejs, {
        data: gg,
        ads: '<!-- tempatkan kode iklan di sini -->',
        currentPage: currentPage,
        totalPages: Math.ceil(this.data.length / itemsPerPage)
      });
    } else {
      this.cookies.render(this.ejs, {
        data: gg,
        ads: "google.com, pub-2998592050723815, DIRECT, f08c47fec0942fa0",
        currentPage: currentPage,
        totalPages: Math.ceil(this.data.length / itemsPerPage)
      });
    }

    postCounter++;
  }

}

app.get("/page/:pageNumber", function(req, res) {
  const applicationFunction = new Application(data, "home", req.params.pageNumber, res);
  applicationFunction.getFunction();
});

app.get("/videos/page/:pageNumber", function(req, res) {
  const applicationFunction = new Application(datavid, "vid", req.params.pageNumber, res);
  applicationFunction.getFunction();
});

//TODO and the next function when aplication first load on client(the algorithm is same, so dont be confused) :D
app.get("/", function(req, res) {
  const applicationFunction = new Application(data, "home", req.params.pageNumber, res);
  applicationFunction.getFunction();
});
app.get("/videos", function(req, res) {
  const applicationFunction = new Application(datavid, "vid", req.params.pageNumber, res);
  applicationFunction.getFunction();
});
//TODO in this function, its just loaded the shared link and move the data to first on array
app.get("/share/:noteId", function(req, res) {
  shuf = false;
  const noteIdGet = parseInt(req.params.noteId.trim());

  const itemIndex = data.findIndex(({noteId}) => noteId == noteIdGet)

  if (itemIndex !== -1) {
    const item = data.splice(itemIndex, 1)[0];
    data.unshift(item);
  }

  res.redirect("/");
});
//? ======================================================================================
//* okay, the next one will be little harder
//TODO first, the function to post menfess
/**
 * @param {mainModel} model 
 */
async function post(data, noteContent, noteName, noteId, color, model, file, res) {
  try {
    if (noteContent.trim() !== "" && noteName.trim() !== "") {
      //TODO next we will add the post to database first.
      await model.create({ noteContent, noteName, noteId, color, comment: [], like: 0})
      data.unshift({ noteId, noteContent, noteName, like: 0, comment: [], color })
      shuf = false
    }
    if (file) {
      const ext = file.filename.split(".")[file.filename.split(".").length - 1]
      if (ext == "jpg") {
        console.log(file)
        fs.readFile(path.join(__dirname, '/public/images/uploads', 'image-'+noteId+'.jpg'), async function(err, data) {
          if (err) throw err; // Fail if the file can't be read.
          await imagekit.upload({
            file : data, //required
            fileName : 'image-'+noteId+'.jpg', //required
            useUniqueFileName: false,
          }, function(error, result) {
            if(error) console.log(error);
            else console.log(result);
            res.redirect("/")
          });
        });
        const imageFileName = `image-${noteId}.jpg`;
        const imageFilePath = path.join(__dirname, '/public/images/uploads', imageFileName);
        if (fs.existsSync(imageFilePath)) {
          fs.unlinkSync(imageFilePath);
        }
      }else if(ext == "mp4"){
        console.log(file)
        fs.readFile(path.join(__dirname, '/public/videos', 'video-'+noteId+'.mp4'), async function(err, data) {
          if (err) throw err; // Fail if the file can't be read.
          await imagekit.upload({
            file : data, //required
            fileName : 'video-'+noteId+'.mp4', //required
            useUniqueFileName: false,
          }, function(error, result) {
            if(error) console.log(error);
            else console.log(result);
            res.redirect("/")
          });
        });
        const imageFileName = `video-${noteId}.mp4`;
        const imageFilePath = path.join(__dirname, '/public/videos', imageFileName);
        if (fs.existsSync(imageFilePath)) {
          fs.unlinkSync(imageFilePath);
        }
      }
    } else if (res) res.redirect("/")
  } catch (err) {
    console.error(err)
  }
}

app.post("/",upload.single("image"), async (req, res) => {
  //TODO first things, we will make the const variable from the req data
  const noteContent = req.body.noteContent
  const noteName = req.body.noteName
  const noteId = data.length + 100;
  const noteColor = req.body.noteColor
  const file = req.file;

  //TODO then call the function
  await post(data, noteContent, noteName, noteId, noteColor, mainModel, file, res);
})
//* second function is to post comment. The algorithm is same, but in comment a little tricky
//TODO its because we need has the noteId position on array.

//* overall, its same
app.post("/comment/:noteId", (req, res) => {
  const commentContent = req.body.commentContent;
  const commenterName = req.body.commenterName;
  const noteIdPost = parseInt(req.params.noteId.trim());
  const commentID = data.length + 50;

  if (commentContent.trim() !== "" && commenterName.trim() !== "") {
    mainModel.findOneAndUpdate({ noteId: noteIdPost }, { $push: { comment: { commentContent, commentId: commentID, commenterName } } })
      .then(() => {
        const itemIndex = data.findIndex(({noteId}) => noteId == noteIdPost)

        if (itemIndex !== -1) {
          const item = data.splice(itemIndex, 1)[0];
          data.unshift(item);
          item.comment.push({ commentID, commenterName, commentContent });
        }

        shuf = false;
        res.redirect("/")
      })
      .catch(err => console.error(err))
  }
});

app.post("/videos/comment/:noteId", (req, res) => {
  const commentContent = req.body.commentContent;
  const commenterName = req.body.commenterName;
  const noteIdPost = parseInt(req.params.noteId.trim());
  const commentID = datavid.length + 50;

  if (commentContent.trim() !== "" && commenterName.trim() !== "") {
    videoModel.findOneAndUpdate({ noteId: noteIdPost }, { $push: { comment: { commentContent, commentId: commentID, commenterName } } })
      .then(() => {
        const itemIndex = datavid.findIndex(({noteId}) => noteId == noteIdPost)

        if (itemIndex !== -1) {
          const item = datavid.splice(itemIndex, 1)[0];
          datavid.unshift(item);
          item.comment.push({ commentID, commenterName, commentContent });
        }

        shuf = false;
        res.redirect("/videos")
      })
      .catch(err => console.error(err))
  }
});
//* third function is to post video. THe algorithm is same, nothing different.
app.post("/videos", uploadvid.single('video'), async (req, res) => {
  const noteContent = req.body.noteContent;
  const noteName = req.body.noteName;
  const noteId = datavid.length + 100;
  const file = req.file;

  //TODO then call the function
  await post(datavid, noteContent, noteName, noteId, null, videoModel, file, res);
});
//TODO fourth, we will be like button

app.post("/like/:noteId", (req, res) => {
  //TODO first the shuf we will be false
  shuf = false;
  const noteIdPost = parseInt(req.params.noteId.trim());

  //TODO next we will be search the position of noteId
  const itemIndex = data.findIndex(({noteId}) => noteId == noteIdPost)

  if (itemIndex !== -1) {
    const item = data.splice(itemIndex, 1)[0];
    data.unshift(item);
    if (!item.hasLiked) {
      //TODO like usualy,the script will run the database first
      mainModel.findOneAndUpdate({noteId: noteIdPost}, { $inc: { like: 1 } })
        .then(() => {
          item.like >= 0 ? item.like++ : item.like = 1
          item.hasLiked = true;
          res.cookie(`liked_${noteIdPost}`, "true");
          res.redirect("/");
        })
        .catch(err => console.error(err))
    }
  }
});

//TODO lets make Share Feature
app.post("/share/:noteId", (req, res) => {
  //TODO first the shuf we will be false
  shuf = false;
  const noteIdPost = parseInt(req.params.noteId.trim());

  //TODO next we will be search the position of noteId
  const itemIndex = data.findIndex(({noteId}) => noteId == noteIdPost)

  if (itemIndex !== -1) {
    const item = data.splice(itemIndex, 1)[0];
    data.unshift(item);

  }
});

//* the algorithm of like in videos is same
app.post("/videos/like/:noteId", (req, res) => {
  shuf = false;
  const noteIdPost = parseInt(req.params.noteId.trim());

  const itemIndex = datavid.findIndex(({noteId}) => noteId == noteIdPost)

  if (itemIndex !== -1) {
    const item = datavid.splice(itemIndex, 1)[0];
    data.unshift(item);
    if (!item.hasLiked) {
      //TODO like usualy,the script will run the database first
      videoModel.findOneAndUpdate({noteId: noteIdPost}, { $inc: { like: 1 } })
        .then(() => {
          item.like >= 0 ? item.like++ : item.like = 1
          item.hasLiked = true;
          res.cookie(`liked_${noteIdPost}`, "true");
          res.redirect("/videos");
        })
        .catch(err => console.error(err))
    }
  }
});
//? ======================================================================

//TODO next will be admin feature, overall its just add the delete function
app.get("/admin", function(req, res) {
  for ({ noteId } of data) {
    data.find((note) => note.noteId === noteId).hasLiked = req.cookies[`liked_${noteId}`] === "true";
  }
  var gg;
  if (shuf == true) {
    gg = shuffleOnClient(data)
  } else {
    shuf = true;
    gg = data;
  }
  res.render("admin", {
    data: gg,
  });
})
app.post('/delete/:noteId', (req, res) => {
  const noteId = parseInt(req.params.noteId.trim());

  mainModel.findOneAndDelete({ noteId })
    .then(() => {
        const imageFileName = `image-${noteId}.jpg`;
        const imageFilePath = path.join(__dirname, '/public/images/uploads', imageFileName);
        if (fs.existsSync(imageFilePath)) {
          fs.unlinkSync(imageFilePath);
        }
        var j = 0;
        data.forEach(note => {
          j = j + 1;
          if (note.noteId == noteId) {
            data.splice((j - 1), 1)
          }
        })

        res.redirect("/admin")
    })
    .catch(console.error(err))
})
//? ======================================================================
//* the the Memes and Anime channel. The function use the old algorithm so you can ignore :)

app.get("/memes", function(req, res) {
  res.render("memes", {
    data: dataMemes
  })
})
app.get("/anime", function(req, res) {
  res.render("anime", {
    data: dataAnime
  })
})
app.post("/memes", uploadMemes.single('image'), (req, res) => {
  const noteContent = req.body.noteContent
  const noteName = req.body.noteName
  const noteId = dataMemes.length + 1;

  if (noteName && noteContent && noteName.toLowerCase() !== "test" && noteContent.toLowerCase() !== "test") {
    sqlMemes = 'INSERT INTO data(noteId,noteContent,noteName) VALUES (?,?,?)';
    dbMemes.run(sqlMemes, [noteId, noteContent, noteName], (err) => {
      if (err) return console.error(err.message);
    })
  }

  dataMemes.push({ noteId, noteContent, noteName });
  res.render("memes", {
    data: dataMemes
  })
})
app.post("/anime", uploadAnime.single('image'), (req, res) => {
  const noteContent = req.body.noteContent
  const noteName = req.body.noteName
  const noteId = dataAnime.length + 1;

  if (noteName && noteContent && noteName.toLowerCase() !== "test" && noteContent.toLowerCase() !== "test") {
    sqlMemes = 'INSERT INTO data(noteId,noteContent,noteName) VALUES (?,?,?,?)';
    dbMemes.run(sqlMemes, [noteId, noteContent, noteName], (err) => {
      if (err) return console.error(err.message);
    })
  }

  dataAnime.push({ noteId, noteContent, noteName });
  res.render("anime", {
    data: dataAnime
  })
})
//* =======================================================================
//TODO finnaly, we will be export the app and will run on "index.js" script :)
module.exports = app
//* =======================================================================
//! © The script created by M.Fathin Halim(Doma Tomoharu) and The Friends. 
//? If you want copy it, you need to change it and you cant use ALL our script to your apps:/