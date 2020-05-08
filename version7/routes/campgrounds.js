var express = require('express');
var router  = express.Router(); 
var Campground = require('../models/campgrounds.js');

//INDEX
router.get("/",function(req,res){
     //get all campgrounds from DB
    Campground.find({},function(err , allcampgrounds){
        if(err){
            console.log("Error!");
            console.log(err);
        } 
        else{
            res.render("campgrounds/index",{Campgrounds : allcampgrounds});
        }
    });
    // res.render("camgrounds",{Campgrounds : campgrounds}); // typo its actually campgrounds
})

 // REST convention .get and .post has same url
//CREATE 
router.post("/",function(req,res){
    var name = req.body.name ; //.name is variable from form
    var image = req.body.image; // .image is variable from form
    var description = req.body.description;// .description id variable from form
    var newCampground = {name : name , image : image , description:description};//as an object
      
     Campground.create(
        newCampground , function(err , newCreate){
            if(err){
                console.log(err);
            }
            else{
                 res.redirect("/campgrounds");//redirect back to campgrounds
            }
        }
     )
    //res.send("You hit post route")   
   
});

//NEW
router.get("/new",function(req,res){
    res.render("campgrounds/new") //form page
});

//SHOW 
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err , foundCamp){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCamp);
            res.render("campgrounds/show",{campground : foundCamp});
        }
    })
    //res.send("This will be show page one day");
});

module.exports = router; 