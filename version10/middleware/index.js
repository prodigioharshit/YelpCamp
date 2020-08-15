// all the middleware goes here
var Campground = require('../models/campgrounds');
var Comment = require('../models/comment');
var middlewareObj = {}

//middleware checkCampgroundOwnership
middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
       if(err || !foundCampground){
           req.flash("error","Cannot find Campground");
           res.redirect("/campgrounds");
       }
       else{
           //does user own campground
           if(foundCampground.author.id.equals(req.user._id)){
              next();
           }
           else{
               console.log("You do not have the permission")
               req.flash("error","You don't have the permission to do that ");
               res.redirect("back");
           }
       }
   });
  }
    else{
        console.log("Not logged in");
        req.flash("error","You need to be logged in!");
        res.redirect("back");
    }
}

//middleware checkCommentOwnership
middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
       if(err || !foundComment){
           req.flash("error","Comment not found");
           res.redirect("/campgrounds");
       }
       else{
           //does user own comment
           if(foundComment.author.id.equals(req.user._id)){
              next();
           }
           else{
               console.log("You do not have the permission")
               req.flash("error","You don't have permission to do that");
               res.redirect("back");
           }
       }
   });
  }
    else{
        console.log("Not logged in");
        req.flash("error","You need to be logged in!");
        res.redirect("back");
    }
}

//middleware isLoggedIn 
middlewareObj.isLoggedIn = function isLoggedIn(req , res , next){
    if(req.isAuthenticated() == true){
        return next();
    }
    req.flash("error","You need to be logged in!");
    res.redirect("/login");
}


module.exports = middlewareObj