const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware");

require("dotenv").config();


// Init router

const noteRouter = express.Router();


// Import schema

const Note = require("../models/note.js");
const _Class = require("../models/class.js");


// Middleware

const validateClass = async (req, res, next) => {
    try{
        const _class = await _Class.findOne({ "_id": req.params.classID });
        if(_class === null) throw new Error;
        req.class = _class;
    }catch(err){
        return res.status(404).json("Cannot find class");
    }
    next();
}

const validateNote = async (req, res, next) => {
    try{
        const note = req.class.notes.filter(note => note._id.toString() === req.params.noteID.toString())[0];
        if(note === null) throw new Error;
        req.note = note;
    }catch(err){
        return res.status(404).json("Cannot find note");
    }
    next();
}


// Retrieve all notes from given class

noteRouter.get("/:classID", validateClass, async (req, res) => {
    res.json(req.class.notes)
})


// Retrieve a note from given class

noteRouter.get("/:classID/:noteID", validateClass, validateNote, async (req, res) => {
    res.json(req.note);
})


// Add a new note to given class

noteRouter.post("/:classID", authMiddleware, validateClass, async (req, res) => {
    if(!req.body.title || !req.body.content) return res.status(400).json('Missing fields!')
    const newNote = new Note({
        "title": req.body.title,
        "content": req.body.content,
        "resource": req.body.resource,
        "sidenote": req.body.sidenote
    });
    const newNotes = req.class.notes.push(newNote);
    await req.class.updateOne({ "notes": req.class.notes });
    res.json(newNote);
})


// Delete a note

noteRouter.delete("/:classID/:noteID", authMiddleware, validateClass, validateNote, async (req, res) => {
    const newNotes = req.class.notes.filter(note => !(note._id.toString() === req.note._id.toString()));
    await req.class.updateOne({ "notes": newNotes });
    res.json(req.note);
})


// Update a note

noteRouter.patch("/:classID/:noteID", authMiddleware, validateClass, validateNote, async (req, res) => {
    if(!req.body.title || !req.body.content) return res.status(400).json("Missing fields!")
    const newNotes = req.class.notes.map(note => {
        if(note._id.toString() === req.params.noteID.toString()){
            note.title = req.body.title,
            note.content = req.body.content,
            note.resource = req.body.resource,
            note.sidenote = req.body.sidenote
        };
        return note;
    });
    await req.class.updateOne({ "notes": newNotes });
    const updatedClass = await _Class.findOne({ "_id": req.params.classID });
    const updatedNote = updatedClass.notes.filter(note => note._id.toString() === req.params.noteID.toString())[0];
    res.json(updatedNote);
})


module.exports = noteRouter;
