var express = require('express')
var mongoose = require('mongoose')
var body = require('body-parser')
var app = express()
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require("node-sessionstorage")

app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

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

app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
})

app.get('/home/:page', (req, res) => {
    const pageName = req.params.page;
    var person = session.getItem('user');
    res.render(pageName, {
        person : person
    });
});    

// app.get("/home", function (req, res) {
//     res.render("home", { person: req.user });
// })

// app.post("/login", function(req, res) {
//     var un=req.body.username;
//     var p=req.body.pass;
//     usermodel.findOne({username: un}, function(err, search){
//         if(err){
//             res.redirect("/login")
//         }
//         else if (p == search.password) {
//             storage.setItem('person', search)
//             stor.setItem('person', search);
//             res.redirect("/home")
//         }
//         else if (p != search.password) {
//             res.redirect("/login")
//         }
//         else {
//             console.log(err)
//             res.redirect("/login")
//         }
//     })    
// });

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    function(req, res) {
        session.setItem('user', req.user);
        res.render('home', {person : req.user});
    }
);

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

app.post("/register", function (req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var mobile = req.body.mobile;
    var password = req.body.pass;
    var confirmpass = req.body.confirmpass;
    var newuser = { name: name, username: username, mobile: mobile, password: password };
    usermodel.create(newuser, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            if (confirmpass === password) {
                res.render("login");
            }
            else {
                console.log("The two passwords didnt match. Try Again!");
                res.render("register");
            }
        }
    })
});



function initializePassport(passport) {
    passport.use(new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'pass'
        },
        function (username, password, done) {
            usermodel.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (password !== user.password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}

app.listen(3040, "localhost", function () {
    console.log("Connected to server")
})
