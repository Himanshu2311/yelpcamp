var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seed"),
    Comment = require("./models/comments.js"),
    passport =require("passport"),
    localStrategy = require("passport-local")
    User = require("./models/user")
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index");

    mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true,useUnifiedTopology: true});
    app.use(bodyParser.urlencoded({extended:true}));
    app.set("view engine","ejs");
    app.use(express.static(__dirname + "/public"));
    //seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "Himanshu",
    resave : false,
    saveUninitialized : false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//currentUser is now a global variable accessible to every ejs file in this route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/campgrounds/:id/comments/",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(authRoutes);

app.listen(3000,function(){
    console.log("Server started");
});
