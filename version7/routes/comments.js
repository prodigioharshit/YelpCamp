var express = require('express');
var router  = express.Router({mergeParams:true});

var Campground = require('../models/campgrounds.js');
var Comment    = require('../models/comment.js');


//NEW route
router.get("/new",isLoggedIn,function(req,res){
    //find campground by id then render new to send that campground
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground:campground});
        }
    })
    
});

//CREATE route
router.post("/",isLoggedIn,function(req,res){
    //find id of campground
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
   
})

//middleware isLoggedIn 
function isLoggedIn(req , res , next){
    if(req.isAuthenticated() == true){
        return next();
    }
     res.redirect("/login");
}

module.exports = router;