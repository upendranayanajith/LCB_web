const UserModel = require('../Model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const { StatusCodes } = require('http-status-codes');

const  login = async(req, res) => {
const{username, password, userType} = req.body;
await UserModel.findOne({username: username}) 
.then(user=>{
    if(user){
        var username = user.username;
        bcrypt.compare(password,user.password, async (err,response)=>{
            if(response){
              const token = jwt.sign({username: user.username, userType: user.userType},
                "jwt-secret-key",{expiresIn: '1d'});

                if(user.userType === 'admin'){
                    res.status(StatusCodes.OK).json({message: 'Admin Logged in Successfully', token});
                }else{
                    res.status(StatusCodes.OK).json({message: 'User Logged in Successfully', token});
                }
        
   