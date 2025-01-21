const express = require('express');
const userRouter = require("./routes/user.routes")
const userHome = require('./routes/index.routes')
const dotenv = require('dotenv')
dotenv.config();
const connectToDB = require('./config/db')
connectToDB();
const cookieParser = require('cookie-parser');
const indexRouter  = require('./routes/index.routes');
const user = require('./models/user.model');
// const path = require('path')
// const downloadRouter = require('./routes/download.routes')


const app = express();

// set middlewares 
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));


// app.get('/home',(req, res)=>{
//     const user ={
//         avatar: '#'
//     };

//     const files = [
//         {name: 'file1.jpg'},
//         {name:'file2.mp4'},
//     ];

//     res.render('home', {user, files });
// });
// app.use(express.static(path.join(__dirname, 'public')))
// cookie

app.use(cookieParser())
app.use(express.json())
//data 
app.use(express.urlencoded({extended: true}))
//user router
app.use('/user', userRouter)
app.use('/user',userHome)

 
app.listen(3000,()=>{
    console.log("server is running on port 3000");  
})