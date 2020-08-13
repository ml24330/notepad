const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();


// Init router

const classRouter = express.Router();


// Import schema

const _Class = require("../models/class.js");


// Middleware

const validateClass = async (req, res, next) => {
    try{
        const _class = await _Class.findOne({ "_id": req.params.id });
        if(_class === null) throw new Error;
        req.class = _class;
    }catch(err){
        return res.status(404).json("Cannot find class");
    }
    next();
}


// Retrieve all classes

classRouter.get("/", async (req, res) => {
    const classes = await _Class.find({});
    res.json(classes);
})


// Retrieve a class

classRouter.get("/:id", validateClass, async (req, res) => {
    res.json(req.class);
})


// Add a new class

classRouter.post("/", async (req, res) => {
    if(req.body.name === null){
        return res.status(400).json("Missing arguments!");
    }
    try{
        const _newClass = new _Class({
            "name": req.body.name,
            "prof": req.body.prof,
            "start_date": req.body.start_date,
            "end_date": req.body.end_date,
            "notes": []
        });
        await _newClass.save();
        res.json(_newClass);
    }catch(err){
        return res.status(400).json(err);
    }
})


// Delete a class

classRouter.delete("/:id", validateClass, async (req, res) => {
    await req.class.deleteOne();
    res.json(req.class);
})


// Update a class

classRouter.patch("/:id", validateClass, async (req, res) => {
    if(!req.body.name || !req.body.start_date || !req.body.end_date) return res.status(400).json("Missing fields!")
    await req.class.updateOne(req.body);
    const updatedClass = await _Class.findOne({ "_id":req.params.id });
    res.json(updatedClass);
})


module.exports = classRouter;
