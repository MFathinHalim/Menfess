const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
let sql;
let sqlMemes;
let sqlAnime;
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `image-${data.length+1}.jpg`);
  }
});
const storageMemes = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'public/images/uploads/memes');
	},
	filename: function (req, file, cb) {
	  cb(null, `image-${dataMemes.length+1}.jpg`);
	}
  });
  const storageAnime = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'public/images/uploads/anime');
	},
	filename: function (req, file, cb) {
	  cb(null, `image-${dataAnime.length+1}.jpg`);
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

const {notes, memes, anime} = require("./notes")
function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
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
var dataMemes = memes;
var dataAnime = anime;
sql = 'SELECT * FROM data';
		db.all(sql, [], (err, rows) => {
			if(err) return console.error(err.message);
			rows.forEach((row) => {
				console.log(row);
				data.push({
					noteId:row.noteId,
					noteContent: row.noteContent,
					noteName: row.noteName
				});
				
			});
});
sqlMemes = 'SELECT * FROM data';
		dbMemes.all(sql, [], (err, rows) => {
			if(err) return console.error(err.message);
			rows.forEach((row) => {
				console.log(row);
				dataMemes.push({
					noteId:row.noteId,
					noteContent: row.noteContent,
					noteName: row.noteName
				});
				
			});
});
sqlAnime = 'SELECT * FROM data';
		dbAnime.all(sql, [], (err, rows) => {
			if(err) return console.error(err.message);
			rows.forEach((row) => {
				console.log(row);
				dataAnime.push({
					noteId:row.noteId,
					noteContent: row.noteContent,
					noteName: row.noteName
				});
				
			});
});

const app = express()

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

app.get("/", function (req, res) {
	shuffle(data);
	res.render("home", {
		data: data
	})
})
app.get("/memes", function (req, res) {
	shuffle(dataMemes);
	res.render("memes", {
		data: dataMemes
	})
})
app.get("/anime", function (req, res) {
	shuffle(dataAnime);
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
app.post("/",upload.single('image'), (req, res) => {
	const noteContent = req.body.noteContent
    const noteName = req.body.noteName
	const noteId = data.length+1;
	
    // All good
	if(noteName && noteContent&& noteName.toLowerCase()!=="test" && noteContent.toLowerCase()!=="test"){
		//notes.push({
			//noteId: noteId,
			//noteContent: noteContent,
			//noteName: noteName,
			
			//})
			
			sql = 'INSERT INTO data(noteId,noteContent,noteName) VALUES (?,?,?)';
			db.run(sql, [noteId, noteContent, noteName], (err) => {
				if (err) return console.error(err.message);
			})
		}

			data.push({
				noteId:noteId,
				noteContent: noteContent,
				noteName: noteName
			});
		res.render("home", {
			data: data
		})
	})
	app.post("/memes",uploadMemes.single('image'), (req, res) => {
		const noteContent = req.body.noteContent
		const noteName = req.body.noteName
		const noteId = dataMemes.length+1;
		
		// All good
		if(noteName && noteContent&& noteName.toLowerCase()!=="test" && noteContent.toLowerCase()!=="test"){
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
					noteId:noteId,
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
			var noteContentComment= req.body.noteContentComment;
			var noteNameComment = req.body.noteNameComment;
			console.log(noteId);
			shuffle(data);
			
		
	
			res.render("memes", {
				data: dataMemes
			})
		})

		app.post("/anime",uploadAnime.single('image'), (req, res) => {
			const noteContent = req.body.noteContent
			const noteName = req.body.noteName
			const noteId = dataAnime.length+1;
			
			// All good
			if(noteName && noteContent&& noteName.toLowerCase()!=="test" && noteContent.toLowerCase()!=="test"){
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
		
					dataAnime.push({
						noteId:noteId,
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
				var noteContentComment= req.body.noteContentComment;
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

		if(noteImg==undefined){
			noteImg.remove();
		}
		
	

		res.render("home", {
			data: data
		})
	})

app.post('/delete', (req, res) => {
	var noteId = req.body.noteId;
	sql = 'DELETE FROM data WHERE id=?';
	db.run(sql, [noteId], (err)=>{
		if(err) return console.error(err.message);
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


app.post('/r', (req, res) => {
	shuffle(data);
	res.render("home", {
		data: data
	})
})

module.exports = {
    app: app
}
