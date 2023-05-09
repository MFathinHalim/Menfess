/*
  * *Hello, My name is M.Fathin Halim/Doma Tomoharu. This is code for my Application called "Menfess"! :D 
*/

//TODO First we will be import the package from "node_modules" folder.
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require("cookie-parser");
const fs = require('fs');
const multer = require('multer');
const fileupload = require('express-fileupload'); 
const FormData = require('form-data')


// SDK initialization

var ImageKit = require("imagekit");

//* Just variable for SQL command
let sql;
let sqlMemes;

//TODO Make ImageKit
var imagekit = new ImageKit({
  publicKey : "public_sfR8hcnPMIJ1ilavSLhv5IZiZ7E=",
  privateKey : "private_eKrKi5RKb3/NijnWKF82mNgH4gA=",
  urlEndpoint : "https://ik.imagekit.io/9hpbqscxd"
});


//TODO Now, we will make the storage with Multer:

//* Main Storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, `image-${data.length + 100}.jpg`);
  }
});
//* Video Storage
const storageVid = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/videos/');
  },
  filename: function(req, file, cb) {
    cb(null, `video-${datavid.length + 100}.mp4`);
  }
});

//* You can ignore this
const storageMemes = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/uploads/memes');
  },
  filename: function(req, file, cb) {
    cb(null, `image-${dataMemes.length + 1}.jpg`);
  }
});
const storageAnime = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/uploads/anime');
  },
  filename: function(req, file, cb) {
    cb(null, `image-${dataAnime.length + 1}.jpg`);
  }
});
//? ==================================================
//TODO Now will make the connection variable to connect from multer Storage

const upload = multer({ storage: storage });
const uploadvid = multer({ storage: storageVid });
const uploadMemes = multer({ storage: storageMemes });
const uploadAnime = multer({ storage: storageAnime });

//? =================================================== 
const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});
const dbvid = new sqlite3.Database("./video.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});
const dbMemes = new sqlite3.Database("./memes.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});
const dbAnime = new sqlite3.Database("./anime.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});
//? ===============================================

//TODO Now will make the data list variable
const { notes, memes, anime, notesC } = require("./notes");
const { error } = require('console');
var data = notes; //* Main Data
var datavid = []; //* Video data
var dataMemes = memes;
var dataAnime = anime;

//TODO and then connect the data variable to SQLITE3
sql = 'SELECT * FROM data ORDER BY Like DESC';
db.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);
  const promises = rows.map(({ color, noteId, noteContent, noteName, Like }) => {
    if (color == null) {
      color = Math.floor(Math.random() * 4);
    }
    const noteData = { noteId, noteContent, noteName, like: Like, comment: [], color };
    const commentSql = 'SELECT * FROM comment WHERE noteId = ?';
    return new Promise((resolve, reject) => {
      db.all(commentSql, [noteId], (err, commentRows) => {
        if (err) return reject(err.message);
        for ({ commenterName, commentContent} of commentRows) {
          noteData.comment.push({ commenterName, commentContent });
        };
        resolve(noteData);
      });
    });
  });
  Promise.all(promises)
    .then((dataWithComments) => {
      data = dataWithComments;
    })
    .catch((err) => {
      console.error(err.message);
    });
});
//? ===============================================
sql = 'SELECT * FROM data';
dbvid.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);
  for ({ noteId, noteContent, noteName, Like } of rows) {
    const noteData = { noteId, noteContent, noteName, like: Like, comment: [] };
    const commentSql = 'SELECT * FROM comment WHERE noteId = ?';
    db.all(commentSql, [noteId], (err, commentRows) => {
      if (err) return console.error(err.message);
      for ({commentId, commenterName, commentContent} of commentRows) {
        noteData.comment.push({ commentId, commenterName, commentContent });
      };
      datavid.push(noteData);
    });
  };
});
//? ===============================================
sqlMemes = 'SELECT * FROM data';
dbMemes.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);
  for ({ noteId, noteContent, noteName } of rows) {
    dataMemes.push({ noteId, noteContent, noteName });
  };
});
sqlAnime = 'SELECT * FROM data';
dbAnime.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);
  for ({ noteId, noteContent, noteName } of rows) {
    dataAnime.push({ noteId, noteContent, noteName });
  };
});
//? ===============================================
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

  let itemIndex = -1;
  for ({ noteId } of data) {
    if (noteId == noteIdGet) {
      itemIndex = i;
      break;
    }
  }

  if (itemIndex !== -1) {
    const item = data.splice(itemIndex, 1)[0];
    data.unshift(item);
  }

  res.redirect("/");
});
//? ======================================================================================
//* okay, the next one will be little harder
//TODO first, the function to post menfess
function post(data, noteContent, noteName, noteId, color, db) {
  try {

    if (noteContent.trim() !== "" && noteName.trim() !== "") {
      //TODO next we will add the post to database first.
      sql = 'INSERT INTO data(noteId,noteContent,noteName,color) VALUES (?,?,?,?)';
      db.run(sql, [noteId, noteContent, noteName, color], (err) => {
        setTimeout(() => {
          if (!err) {
            // TODO: add data to array
            //TODO if not error, the array data will add it
            data.unshift({ noteId, noteContent, noteName, like: 0, comment: [], color });
            //TODO the shuf will be false because we want to post is in first on array
            shuf = false;
          } else {
            console.error(err);
          }
        }, 1000);
      })
    }
  } catch {
    console.log("Ada yang error")
  }
}
app.post("/",upload.single("image"), (req, res) => {
  //TODO first things, we will make the const variable from the req data
  const noteContent = req.body.noteContent
  const noteName = req.body.noteName
  const noteId = data.length + 100;
  const noteColor = req.body.noteColor
  const file = req.file;
  
  console.log(file)
  fs.readFile(path.join(__dirname, '/public/images/uploads', 'image-'+noteId+'.jpg'), function(err, data) {
    if (err) throw err; // Fail if the file can't be read.
    imagekit.upload({
      file : data, //required
      fileName : 'image-'+noteId+'.jpg', //required
      useUniqueFileName: false,
    }, function(error, result) {
      if(error) console.log(error);
      else console.log(result);
    });
  });
  const imageFileName = `image-${noteId}.jpg`;
      const imageFilePath = path.join(__dirname, '/public/images/uploads', imageFileName);
      if (fs.existsSync(imageFilePath)) {
        fs.unlinkSync(imageFilePath);
      }
  //TODO then call the function
  post(data, noteContent, noteName, noteId, noteColor, db);

  res.redirect("/")
})
//* second function is to post comment. The algorithm is same, but in comment a little tricky
//TODO its because we need has the noteId position on array.

//* overall, its same
app.post("/comment/:noteId", (req, res) => {
  const commentContent = req.body.commentContent;
  const commenterName = req.body.commenterName;
  const noteIdPost = parseInt(req.params.noteId.trim());
  const commentID = data.length + 50;

  if (noteContent.trim() !== "" && noteName.trim() !== "") {
    sqlMemes = 'INSERT INTO comment(noteId,commentId,commentContent,commenterName) VALUES (?,?,?,?)';
    db.run(sqlMemes, [noteIdPost, commentID, commentContent, commenterName], (err) => {
      if (!err) {
        let itemIndex = -1;
        for ({ noteId } of data) {
          if (noteId == noteIdPost) {
            itemIndex = i;
            break;
          }
        }

        if (itemIndex !== -1) {
          const item = data.splice(itemIndex, 1)[0];
          data.unshift(item);
          item.comment.push({ commentID, commenterName, commentContent });
        }

        shuf = false;
        res.redirect("/")
      }
    });


  }


});
app.post("/videos/comment/:noteId", (req, res) => {
  const commentContent = req.body.commentContent;
  const commenterName = req.body.commenterName;
  const noteIdPost = parseInt(req.params.noteId.trim());
  const commentID = datavid.length + 50;

  if (noteContent.trim() !== "" && noteName.trim() !== "") {
    sqlMemes = 'INSERT INTO comment(noteId,commentId,commentContent,commenterName) VALUES (?,?,?,?)';
    dbvid.run(sqlMemes, [noteIdPost, commentID, commentContent, commenterName], (err) => {
      if (!err) {
        let itemIndex = -1;
        for ({ noteId } of datavid) {
          if (noteId == noteIdPost) {
            itemIndex = i;
            break;
          }
        }

        if (itemIndex !== -1) {
          const item = datavid.splice(itemIndex, 1)[0];
          datavid.unshift(item);
          item.comment.push({ commentId, commenterName, commentContent });
        }

        shuf = false;
        res.redirect("/videos")
      }
    });
  }
});
//* third function is to post video. THe algorithm is same, nothing different.
app.post("/videos", uploadvid.single('video'), (req, res) => {
  const noteContent = req.body.noteContent;
  const noteName = req.body.noteName;
  const noteId = datavid.length + 100;

  //TODO then call the function
  post(datavid, noteContent, noteName, noteId, dbvid, "/", res);
});
//TODO fourth, we will be like button

app.post("/like/:noteId", (req, res) => {
  //TODO first the shuf we will be false
  shuf = false;
  const noteIdPost = parseInt(req.params.noteId.trim());

  //TODO next we will be search the position of noteId
  let itemIndex = -1;
  for ({ noteId } of data) {
    if (noteId == noteIdPost) {
      itemIndex = i;
      break;
    }
  }

  if (itemIndex !== -1) {
    const item = data.splice(itemIndex, 1)[0];
    data.unshift(item);
    if (!item.hasLiked) {
      //TODO like usualy,the script will run the database first

      db.run("UPDATE data SET Like = Like + 1 WHERE noteId = ?", [noteIdPost], function(err) {
        item.like++
        if (err) {
          return console.log(err.message);
        }
        item.hasLiked = true;
        res.cookie(`liked_${noteIdPost}`, "true");
        res.redirect("/");
      });
    }
  }
});
//* the algorithm of like in videos is same
app.post("/videos/like/:noteId", (req, res) => {
  shuf = false;
  const noteIdPost = parseInt(req.params.noteId.trim());

  let itemIndex = -1;
  for ({ noteId } of datavid) {
    if (noteId == noteIdPost) {
      itemIndex = i;
      break;
    }
  }

  if (itemIndex !== -1) {
    const item = datavid.splice(itemIndex, 1)[0];
    datavid.unshift(item);

    if (!item.hasLiked) {

      sql = 'UPDATE data SET "Like" = ? WHERE noteId = ?';
      dbvid.run(sql, [item.like + 1, noteIdPost], (err) => {
        if (!err) {
          item.like++;
          item.hasLiked = true;
          res.cookie(`liked_${noteIdPost}`, "true");
          res.redirect("/videos");
        }
      });
    } else {
      res.redirect("/videos");
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

  sql = 'DELETE FROM data WHERE noteId=?';
  db.run(sql, [noteId], (err) => {
    db.run('DELETE FROM comment WHERE noteId=?', [noteId], (err) => {
      if (err) return console.error(err.message);

      sql = 'DELETE FROM data WHERE id=?';
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
  });

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
module.exports = {
  app: app
}
//* =======================================================================
//! © The script created by M.Fathin Halim(Doma Tomoharu). 
//? If you want copy it, you need to change it and you cant use ALL my script to your apps:/
