if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var express= require('express')
var http = require('http')
var mongoose= require('mongoose')
var body= require('body-parser')
var {User} = require('./models/user');

var app= express()

const mongoURI = process.env.MONGODB_URI;



mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.catch((err) => {
    console.log(err);
});

app.use(express.static('public'))
app.set("view engine", "ejs")
app.use(body.urlencoded({ extended: true }))

app.get("/login" , function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})

app.post('/login', function(req, res) {
    console.log(req.body);
});

app.post('/register', function(req, res) {
    // authentication 
    console.log(req.body);
    const newUser = new User(req.body);
    User.create(newUser)
    .then((doc) => {
        console.log(doc);
        res.send(doc);
    })
    .catch((err) => {
        res.send(err);
    })
});

app.listen(3040, "localhost", function () {
    console.log("Connected to server")
})
