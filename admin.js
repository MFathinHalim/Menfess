const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
let sql;

const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
	if (err) return console.error(err.message);
});
//Create table
//sql = 'CREATE TABLE data(id INTEGER PRIMARY KEY,noteId,noteContent,noteName)';
//db.run(sql);

const {notes} = require("./notes")


var data = notes;
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

const app = express()

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

app.get("/", function (req, res) {

	res.render("admin", {
		data: data
	})
})


app.post("/", (req, res) => {
	const noteContent = req.body.noteContent
    const noteName = req.body.noteName
	const noteId = data.length+1;
	
    // All good
	if(noteName!="" && noteContent!="" && noteName.toLowerCase()!="test" && noteContent.toLowerCase()!="test"){
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
		res.render("admin", {
			data: data
		})
	})
	
	app.post('/update', (req, res) => {
		var noteId = req.body.noteId;
		var noteContent = req.body.noteContent;
		var noteName = req.body.noteName;
		var noteIdComment = req.body.noteIdComment;
		var noteContentComment= req.body.noteContentComment;
		var noteNameComment = req.body.noteNameComment;
		console.log(noteId);
		
	

		res.render("admin", {
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

	
	res.render("admin", {
		data: data
	})
})


app.post('/r', (req, res) => {
	res.render("admin", {
		data: data
	})
})

module.exports = {
    app: app
}
