const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware");

require("dotenv").config();


// Init router

const todoRouter = express.Router();


// Import schema

const Todo = require("../models/todo.js");


// Middleware

const validateTodo = async (req, res, next) => {
    try{
        const todo = await Todo.findOne({ "_id": req.params.id });
        if(todo === null) throw new Error;
        req.todo = todo;
    }catch(err){
        return res.status(404).json("Cannot find todo");
    }
    next();
}


// Retrieve all todos

todoRouter.get("/", async (req, res) => {
    const todos = await Todo.find({});
    res.json(todos);
});


// Retrive a todo

todoRouter.get("/:id", validateTodo, async(req, res) => {
    res.json(req.todo);
})


// Add a new todo

todoRouter.post("/", authMiddleware, async (req, res) => {
    if(req.body.subject === null || req.body.duedate === null || req.body.description === null){
        return res.status(400).json("Missing arguments!");
    }
    try{
        const newTodo = new Todo({
            "subject": req.body.subject,
            "duedate": req.body.duedate,
            "description": req.body.description,
            "sidenote": req.body.sidenote
        });
        await newTodo.save();
        res.json(newTodo);
    }catch(err){
        return res.status(400).json(err);
    }
});

// Delete a todo

todoRouter.delete("/:id", authMiddleware, validateTodo, async (req, res) => {
    await req.todo.deleteOne();
    res.json(req.todo);
})

// Update a todo

todoRouter.patch("/:id", authMiddleware, validateTodo, async (req, res) => {
    if(!req.body.subject || !req.body.duedate || !req.body.description) return res.status(400).json("Missing fields!")
    const todo = await req.todo.updateOne(req.body);
    const updatedTodo = await Todo.find({ "_id":req.params.id });
    res.json(updatedTodo);
})

module.exports = todoRouter;
