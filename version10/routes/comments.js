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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
   
})

//EDIT
router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
    //req.params.id is id of campground not comment
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }
        else{
               res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
        }
    })
});

//UPDATE
router.put("/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
       if(err){
           res.redirect("back");
       } 
        else{
            res.redirect("/campgrounds/"+req.params.id); // campgrounds id
        }
    });
});

//DESTROY
router.delete("/:comment_id",checkCommentOwnership,function(req,res){
   // findByIdAndRemove()
    Comment.findByIdAndRemove(req.params.comment_id,function(err,deleteComment){
       if(err){
           res.redirect("back");
       } 
       else{
           res.redirect("/campgrounds/"+req.params.id)
       }
    });
});

//middleware isLoggedIn 
function isLoggedIn(req , res , next){
    if(req.isAuthenticated() == true){
        return next();
    }
     res.redirect("/login");
}

//middleware checkCommentOwnership
function checkCommentOwnership(req, res, next){
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



module.exports = router;