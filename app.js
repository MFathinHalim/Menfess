const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const notes = [{
		noteId: 1,
		noteContent: "Hey, Geeks you can add your important notes here.",
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

	notes.push({
		noteId: noteId,
		noteContent: noteContent,
        noteName: noteName
	})

	res.render("home", {
		data: notes
	})
})

app.post('/update', (req, res) => {
	var noteId = req.body.noteId;
	var noteContent = req.body.noteContent;
    var noteName = req.body.noteName;
	
	notes.forEach(note => {
		if (note.noteId == noteId) {
			note.noteContent = noteContent;
            note.noteName = noteName;
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

app.listen(3000, (req, res) => {
	Host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
	console.log("App is running on port 3000")
})
