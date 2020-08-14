var express = require('express');
var router  = express.Router();
var passport = require('passport');
var User     = require('../models/user.js');


router.get("/",function(req,res){
    res.render("landing");
});



//show register form
router.get("/register",function(req,res){
     res.render("register");
});

//handle sign up form
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){ //.register func provided by passportLocalMongoose
        if(err){
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    })
});

//show login form
router.get("/login",function(req,res){
    res.render("login");
});

//Submit login request
//middleware
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    
    }) , function(req,res){
})

//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
})

//middleware isLoggedIn 
function isLoggedIn(req , res , next){
    if(req.isAuthenticated() == true){
        return next();
    }
     res.redirect("/login");
}

module.exports = router;

