require("dotenv").config();

const auth = (req, res, next) => {
    if(!(req.query.key === process.env.SECRET_TOKEN)){
        return res.status(403).json('Invalid token!');
    }else{
        next();
    }
};

module.exports = auth;
