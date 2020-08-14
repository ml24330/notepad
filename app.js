const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const todoRouter = require("./routers/todo.js");
const classRouter = require("./routers/class.js");
const noteRouter = require("./routers/note.js");
const loginRouter = require("./routers/login.js");

require('dotenv').config();


// Init app

const app = express();
app.use(express.json());
app.use(cors());

PORT = process.env.PORT || 8000;


// Connect to DB

mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PW}@cluster0.swmsg.mongodb.net/Cluster0?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('CONNECTION ESTABLISHED'));


// Routing

app.use('/api/login', loginRouter);
app.use('/api/todo', todoRouter);
app.use('/api/class', classRouter);
app.use('/api/note', noteRouter);


// Serve static assets

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    })
};

if(process.env.NODE_ENV === 'development'){
    app.use(express.static(path.resolve(__dirname, 'client', 'public')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
    });
}

// Start listening

app.listen(PORT, console.log(`Listening on port ${PORT}`));
