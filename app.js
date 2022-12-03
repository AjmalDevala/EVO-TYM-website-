const express = require('express');
const mongoose = require('./config/connection');;
const path = require('path');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const session = require('express-session');
const cookieParser=require('cookie-parser');
const multer = require('multer');
const nocache =require('nocache')

// set app
const app = express();


// set view engine
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')


// use expressjsonformat
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

// Multer (image uplode)

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/admin/evoimg/");
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname +"_" + Date.now() + path.extname(file.originalname))
        constructor(file.fieldname + Date.now() + path.extname(file.originalname)); 
            
        },
    });
   app.use(multer({storage:storage}).single("image"))

//session start

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret:'secret-key',
    resave:true,
    saveUninitialized:true,
    cookie:{maxAge:oneDay}
}))


//routes admin and user 

const { setEngine } = require('crypto');
app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use("*",(req,res)=>{
    res.render('error');
  })


//create port 

const PORT = process.env.PORT || 7007;
app.listen(PORT, console.log("Server started at port: " + PORT))