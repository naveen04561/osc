var express= require('express')
var http = require('http')
var mongoose= require('mongoose')
var body= require('body-parser')
var app= express()
const storage = require('sessionstorage')
const stor= require('node-sessionstorage')

app.use(express.static('public'))
app.set("view engine", "ejs")
app.use(body.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost:27017/deliverysystem", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })


var UserSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        length: 10,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: [
            (input) => input.length >= 6,
            "Password should be longer."
        ]
    }
});

var usermodel = mongoose.model("usermodel", UserSchema);

app.get("/login" , function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})

app.get("/home", function(req, res){
    var person = stor.getItem('person')
    console.log(person.name)
    res.render("home", {person : person});
})

app.post("/login", function(req, res) {
    var un=req.body.username;
    var p=req.body.pass;
    usermodel.findOne({username: un}, function(err, search){
        if(err){
            res.redirect("/login")
        }
        else if (p == search.password) {
            storage.setItem('person', search)
            stor.setItem('person', search);
            res.redirect("/home")
        }
        else if (p != search.password) {
            res.redirect("/login")
        }
        else {
            console.log(err)
            res.redirect("/login")
        }
    })    
});

app.post("/register", function(req, res) {
    var name=req.body.name;
    var username=req.body.username;
    var mobile= req.body.mobile;
    var password=req.body.pass;
    var confirmpass= req.body.confirmpass;
    var newuser= {name: name, username: username, mobile: mobile, password: password};
    usermodel.create(newuser, function(err, user){
        if(err)
        {
            console.log(err);
        }
        else{
            if(confirmpass===password){
                res.render("login");
            }
            else{
                console.log("The two passwords didnt match. Try Again!");
                res.render("register");
            }
        }
    })    
});

app.listen(3040, "localhost", function () {
    console.log("Connected to server")
})
