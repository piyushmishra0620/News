const {signup,login,getuser:userdetails}=require('../Controllers/authcontrollers');
const {protected}=require('../middlewares/authmiddlewares');
const server=require('express').Router();

server.post('/signup',signup);
server.post('/login',login);
server.get('/getuser',protected,userdetails);

module.exports=server;