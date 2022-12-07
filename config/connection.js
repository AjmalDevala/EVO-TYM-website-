//mongodb connect

const mongoose = require('mongoose');


// mongoose.connect('mongodb://localhost:27017/EVOTYM');
 mongoose.connect('mongodb+srv://ajmal:VOFCNb2U89qYgltH@cluster0.a5frclp.mongodb.net/EVOTYM?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true');


const db =  mongoose.connection

db.on('error',error => console.error(error))
db.once('open',()=> console.log('connected to mogoose'))
