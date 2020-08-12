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
router.post("/",isLoggedIn,function(req,res){
    var name = req.body.name ; //.name is variable from form
    var image = req.body.image; // .image is variable from form
    var description = req.body.description;// .description id variable from form
    var author = {
              
          id : req.user._id,
          username : req.user.username
    };
    
    var newCampground = {name : name , image : image , description:description , author:author};//as an object
    
    
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
router.get("/new",isLoggedIn,function(req,res){
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


// EDIT 
router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
    //is user logged in
        Campground.findById(req.params.id,function(err,foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});    
        });
});

// UPDATE
router.put("/:id",checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

//DELETE (DESTROY)
router.delete("/:id",checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err,campgroundRemoved){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
          });
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

//middleware checkCampgroundOwnership
function checkCampgroundOwnership(req, res, next){
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



module.exports = router; 
