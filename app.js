var express= require('express')
var http = require('http')
var mongoose= require('mongoose')
var body= require('body-parser')

var app= express()

app.use(express.static('public'))
app.set("view engine", "ejs")
app.use(body.urlencoded({ extended: true }))

app.get("/login" , function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})

app.listen(3040, "localhost", function () {
    console.log("Connected to server")
})
