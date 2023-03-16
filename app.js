const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require("cookie-parser");
let sql;
let sqlMemes;
let sqlAnime;
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, `image-${data.length + 100}.jpg`);
  }
});
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
const upload = multer({ storage: storage });
const uploadMemes = multer({ storage: storageMemes });
const uploadAnime = multer({ storage: storageAnime });

const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});
const dbMemes = new sqlite3.Database("./memes.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});
const dbAnime = new sqlite3.Database("./anime.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});
//Create table
//sql = 'CREATE TABLE data(id INTEGER PRIMARY KEY,noteId,noteContent,noteName)';
//db.run(sql);

const { notes, memes, anime, notesC } = require("./notes")
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


var data = notes;
var data = notesC
var dataMemes = memes;
var dataAnime = anime;
// First, retrieve all notes from the data table
sql = 'SELECT * FROM data';
db.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);

  // For each note, query the comment table to see if there are any comments associated with it
  rows.forEach((row) => {
    const noteId = row.noteId;
    const noteData = {
      noteId: row.noteId,
      noteContent: row.noteContent,
      noteName: row.noteName,
      like: row.Like,
      comment: []
    };
    const commentSql = 'SELECT * FROM comment WHERE noteId = ?';
    db.all(commentSql, [noteId], (err, commentRows) => {
      if (err) return console.error(err.message);
      commentRows.forEach((commentRow) => {
        noteData.comment.push({
          commentId: commentRow.commentId,
          commenterName: commentRow.commenterName,
          commentContent: commentRow.commentContent
        });
      });
      data.push(noteData);
    });
  });
});


sqlMemes = 'SELECT * FROM data';
dbMemes.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);
  rows.forEach((row) => {
    dataMemes.push({
      noteId: row.noteId,
      noteContent: row.noteContent,
      noteName: row.noteName
    });

  });
});
sqlAnime = 'SELECT * FROM data';
dbAnime.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);
  rows.forEach((row) => {
    dataAnime.push({
      noteId: row.noteId,
      noteContent: row.noteContent,
      noteName: row.noteName
    });

  });
});

const app = express()

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))
var shuf = true;
const crypto = require("crypto");

// generate a hashed seed value using the application name
const appName = "My Application";
const seed = crypto.createHash("sha256").update(appName).digest("hex");

// shuffle the data arrays using the hashed seed value
app.get("/", function(req, res) {
  for (let i = 0; i < data.length; i++) {
    const noteId = data[i].noteId;
    data.find((note) => note.noteId === noteId).hasLiked = req.cookies[`liked_${noteId}`] === "true";
  }
  var gg;
  if (shuf == true) {
    gg = shuffleOnClient(data)
  } else {
    shuf = true;
    gg = data;
  }
  res.render("home", {
    data: gg,
  });
});

function shuffleOnClient(data) {
  const shuffledData = [...data];
  for (let i = shuffledData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
  }
  return shuffledData;
}

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

app.post('/upload-image', upload.single('image'), (req, res) => {
  // req.file contains information about the uploaded file
  // You can save the file information to your database here
  res.render("home", {
    data: data
  })
});
app.post("/", upload.single('image'), (req, res) => {
  const noteContent = req.body.noteContent
  const noteName = req.body.noteName
  const noteId = data.length + 100;

  // All good
  if (noteContent.trim() !== "" && noteName.trim() !== "") {
    //notes.push({
    //noteId: noteId,
    //noteContent: noteContent,
    //noteName: noteName,

    //})

    sql = 'INSERT INTO data(noteId,noteContent,noteName) VALUES (?,?,?)';
    db.run(sql, [noteId, noteContent, noteName], (err) => {
      if (!err){
        data.unshift({
          noteId: noteId,
          noteContent: noteContent,
          noteName: noteName,
          like: 0,
          comment: []
        });
        shuf = false; // update the value of shuf
      }
    })
  }

  
  res.redirect("/")
})
app.post("/like/:noteId", (req, res) => {
  shuf = false;
  const noteId = parseInt(req.params.noteId.trim());

  let itemIndex = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].noteId == noteId) {
      itemIndex = i;
      break;
    }
  }

  if (itemIndex !== -1) {
    const item = data.splice(itemIndex, 1)[0];
    data.unshift(item);

    if (!item.hasLiked) { // if the user has not yet liked the note
      item.like++; // increment the like count
      item.hasLiked = true; // set the hasLiked property to true

      sql = 'UPDATE data SET Like = ? WHERE noteId = ?';
      db.run(sql, [item.like, noteId], (err) => {
        if (!err){
          res.cookie(`liked_${noteId}`, "true"); // set the cookie

          res.redirect("/")
    
        };
      });

    
    } else { // if the user has already liked the note
      res.redirect("/");
    }
  } else {
    console.error(`Item with noteId ${noteId} not found in data array`);
    res.redirect("/");
  }
});

app.post("/memes", uploadMemes.single('image'), (req, res) => {
  const noteContent = req.body.noteContent
  const noteName = req.body.noteName
  const noteId = dataMemes.length + 1;

  // All good
  if (noteName && noteContent && noteName.toLowerCase() !== "test" && noteContent.toLowerCase() !== "test") {
    //notes.push({
    //noteId: noteId,
    //noteContent: noteContent,
    //noteName: noteName,

    //})

    sqlMemes = 'INSERT INTO data(noteId,noteContent,noteName) VALUES (?,?,?)';
    dbMemes.run(sqlMemes, [noteId, noteContent, noteName], (err) => {
      if (err) return console.error(err.message);
    })
  }

  dataMemes.push({
    noteId: noteId,
    noteContent: noteContent,
    noteName: noteName
  });
  res.render("memes", {
    data: dataMemes
  })
})

app.post('/updatememes', (req, res) => {
  var noteId = req.body.noteId;
  var noteContent = req.body.noteContent;
  var noteName = req.body.noteName;
  var noteIdComment = req.body.noteIdComment;
  var noteContentComment = req.body.noteContentComment;
  var noteNameComment = req.body.noteNameComment;
  console.log(noteId);
  shuffle(data);



  res.render("memes", {
    data: dataMemes
  })
})

app.post("/anime", uploadAnime.single('image'), (req, res) => {
  const noteContent = req.body.noteContent
  const noteName = req.body.noteName
  const noteId = dataAnime.length + 1;

  // All good
  if (noteName && noteContent && noteName.toLowerCase() !== "test" && noteContent.toLowerCase() !== "test") {
    //notes.push({
    //noteId: noteId,
    //noteContent: noteContent,
    //noteName: noteName,

    //})

    sqlMemes = 'INSERT INTO data(noteId,noteContent,noteName) VALUES (?,?,?,?)';
    dbMemes.run(sqlMemes, [noteId, noteContent, noteName], (err) => {
      if (err) return console.error(err.message);
    })
  }

  dataAnime.push({
    noteId: noteId,
    noteContent: noteContent,
    noteName: noteName
  });
  res.render("anime", {
    data: dataAnime
  })
})

app.post('/updateanime', (req, res) => {
  var noteId = req.body.noteId;
  var noteContent = req.body.noteContent;
  var noteName = req.body.noteName;
  var noteIdComment = req.body.noteIdComment;
  var noteContentComment = req.body.noteContentComment;
  var noteNameComment = req.body.noteNameComment;
  console.log(noteId);
  shuffle(data);



  res.render("anime", {
    data: dataAnime
  })
})
app.post('/update', (req, res) => {
  var noteId = req.body.noteId;
  var noteImg = req.body.img;
  console.log(noteId);
  shuffle(data);




  res.redirect('/')
})

app.post('/delete', (req, res) => {
  var noteId = req.body.noteId;
  sql = 'DELETE FROM data WHERE id=?';
  db.run(sql, [noteId], (err) => {
    if (err) return console.error(err.message);
  });
  var j = 0;
  data.forEach(note => {
    j = j + 1;
    if (note.noteId == noteId) {
      data.splice((j - 1), 1)
    }
  })


  res.render("home", {
    data: data
  })
})

app.post("/comment/:noteId", (req, res) => {
  const noteContent = req.body.commentContent;
  const noteName = req.body.commenterName;
  const noteId = parseInt(req.params.noteId.trim());
  const commentID = data.length + 50;

  if (noteContent.trim() !== "" && noteName.trim() !== "") {
    sqlMemes = 'INSERT INTO comment(noteId,commentId,commentContent,commenterName) VALUES (?,?,?,?)';
    db.run(sqlMemes, [noteId, commentID, noteContent, noteName], (err) => {
      if (!err){
        let itemIndex = -1;
        for (let i = 0; i < data.length; i++) {
          if (data[i].noteId == noteId) {
            itemIndex = i;
            break;
          }
        }
      
        if (itemIndex !== -1) {
          const item = data.splice(itemIndex, 1)[0];
          data.unshift(item);
          item.comment.push({
            commentId: commentID,
            commenterName: noteName,
            commentContent: noteContent
          });
          console.log(item.comment);
        }
      }
    });
  
    
  }

shuf = false;
res.redirect("/")

  
});


module.exports = {
  app: app
}

