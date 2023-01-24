const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')

const notes = [{
		noteId: 1,
		noteContent: "Hai.",
        noteName: "Doma"
	}
]

const app = express()

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

app.get("/", function (req, res) {
	res.render("home", {
		data: notes
	})
})


app.post("/", (req, res) => {
	const noteContent = req.body.noteContent
    const noteName = req.body.noteName
	const noteId = notes.length + 1;

    // All good

	notes.push({
		noteId: noteId,
		noteContent: noteContent,
        noteName: noteName,
	})

	res.render("home", {
		data: notes
	})
})

app.post('/comment', (req, res) => {
	const noteContent = req.body.noteContentComment
    const noteName = req.body.noteNameComment
	const noteId = req.body.noteId;
	const noteIdComment = noteId + "y";

    // All good

	notes.push({
		noteId: noteId,
		noteIdComment: noteIdComment,
		noteContentComment: noteContent,
        noteNameComment: noteName,
		
	})

	res.render("home", {
		data: notes
	})
})


app.post('/update', (req, res) => {
	var noteId = req.body.noteId;
	var noteContent = req.body.noteContent;
    var noteName = req.body.noteName;
	var noteIdComment = req.body.noteIdComment;
	var noteContentComment= req.body.noteContentComment;
    var noteNameComment = req.body.noteNameComment;
	
	
	notes.forEach(note => {
		if (note.noteId == noteId) {
			note.noteContent = noteContent;
            note.noteName = noteName;
		}
		if (note.noteIdComment == noteIdComment) {
			note.noteContentComment = noteContentComment;
			note.noteNameComment = noteNameComment;
			
		}
		
	})
	res.render("home", {
		data: notes
	})
})

app.post('/delete', (req, res) => {
	var noteId = req.body.noteId;

	var j = 0;
	notes.forEach(note => {
		j = j + 1;
		if (note.noteId == noteId) {
			notes.splice((j - 1), 1)
		}
	})

	res.render("home", {
		data: notes
	})
})
app.post('/deleteCom', (req, res) => {
	var noteId = req.body.noteIdComment;

	var j = 0;
	notes.forEach(note => {
		j = j + 1;
		if (note.noteId == noteId) {
			notes.splice((j - 1), 1)
		}
	})

	res.render("home", {
		data: notes
	})
})

app.post('/r', (req, res) => {

	res.render("home", {
		data: notes
	})
})


app.listen(3000, (req, res) => {
	Host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
	console.log("App is running on port 3000")
})
