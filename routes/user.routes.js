const express = require('express')
const router = express.Router();
const {body, validationResult}= require('express-validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const fileModel = require('../models/files.model')
const authMiddleware = require('../middlewares/auth')
const fs = require('fs')
// const token = require('jsonwebtoken')



// registeration
router.get('/register', (req, res)=>{

    res.render('register')
})

router.post('/register',
    body('email').trim().isEmail().isLength({ min:13 }),
    body('password').trim().isLength({ min:5 }),
    body('username').trim().isLength({ min:3 }),
   async (req, res)=>{

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                eroors: errors.array(),
                message: 'Invalid data'
            })
         }

         const { email, username , password} = req.body;

         const hashPassword = await bcrypt.hash(password, 10)

         const newUser = await userModel.create({
            email,
            username,
            password: hashPassword
         })
        
         res.json(newUser)
})

//login
router.get('/login',(req, res)=>{
    res.render('login')
})

router.post('/login',
    body('username').trim().isLength({min: 3}),
    body('password').trim().isLength({min: 5 }),
    async (req, res) =>{


        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                error: errors.array(),
                message: 'invalid data'
            })
        }

        const {username, password} = req.body;

        const user = await userModel.findOne({
            username:  username
        })

        if(!user){
            return res.status(400).json({
                message: 'username or password is incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({
                message: 'username or password is   incorrect'
            })
        }

        // npm i jsonwentoken

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        },
        process.env.JWT_SECRET,
    )
        // npm i cookie-parser
        res.cookie('token', token)
        res.redirect('/user/home')
        
}
)
// read 
router.get('/get-users', (req, res)=>{
    userModel.find({
        username: 'adarsh'
    }).then((users) => {
        res.send(users)
    })
})

module.exports = router;