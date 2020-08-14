const express = require("express");

require("dotenv").config();

const loginRouter = express.Router();


loginRouter.get("/", (req, res) => {
    if(req.headers.token === process.env.SECRET_TOKEN){
        return res.status(200);
    }else{
        return res.status(403);
    }
})

loginRouter.post("/", (req, res) => {
    if(!(req.body.code === process.env.ACCESS_CODE)){
        return res.status(403).json('Invalid code!');
    }else {
        res.json(process.env.SECRET_TOKEN);
    }
})

module.exports = loginRouter;
