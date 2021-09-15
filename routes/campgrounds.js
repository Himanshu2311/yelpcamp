var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment =require("../models/comments");
//INDEX - displays a list of all campgrounds
router.get("/",function(req,res){


    //Get all campground from db
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("error....");
        }else{
            res.render("campgrounds/index" , {campgrounds:allCampgrounds});
        }
    })    
});


//CREATE - adds a new campground to the db
router.post("/",isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {id:req.user._id,
                  username:req.user.username            
    };
    //add new campground to db
    var newCampground = {name:name,image:image,description:description,author:author};

    Campground.create(newCampground,function(err,campgrounds){
        if(err){
            console.log("error......");
        }
        else{
            //redirect to campground page 
            res.redirect("/campgrounds");
        }
    });
});


//NEW - show form to create new campground
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});


//SHOW - shows more info about one campground
router.get("/:id",function(req,res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log("Error");
        }else{
            //render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }   
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
