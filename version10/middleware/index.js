// all the middleware goes here
var Campground = require('../models/campgrounds');
var Comment = require('../models/comment');
var middlewareObj = {}

//middleware checkCampgroundOwnership
middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           //does user own campground
           if(foundCampground.author.id.equals(req.user._id)){
              next();
           }
           else{
               console.log("You do not have the permission")
               res.redirect("back");
           }
       }
   });
  }
    else{
        console.log("Not logged in");
        res.redirect("back");
    }
}

//middleware checkCommentOwnership
middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           //does user own comment
           if(foundComment.author.id.equals(req.user._id)){
              next();
           }
           else{
               console.log("You do not have the permission")
               res.redirect("back");
           }
       }
   });
  }
    else{
        console.log("Not logged in");
        res.redirect("back");
    }
}

//middleware isLoggedIn 
middlewareObj.isLoggedIn = function isLoggedIn(req , res , next){
    if(req.isAuthenticated() == true){
        return next();
    }
    req.flash("error","Please login first!");
    res.redirect("/login");
}


module.exports = middlewareObj