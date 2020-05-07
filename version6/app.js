var express = require('express'),
      app    = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User   = require('./models/user'),
    Campground = require('./models/campgrounds.js'),
    Comment = require('./models/comment.js');
        seedDB = require("./seeds");

//seedDB();

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost/Yelp");
app.set("view engine","ejs");  

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public")) //__dirname gives path of current working directory

//PASSPORT CONFIGURATION
    app.use(require('express-session')({
        secret:"Calling for an expansion",
        resave:false,
        saveUninitialized:false
    }));
   app.use(passport.initialize());
   app.use(passport.session());
   passport.use(new LocalStrategy(User.authenticate()));
   passport.serializeUser(User.serializeUser());
   passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user; //passport will provide logged in info about all the users to every route.
    next();
});

app.get("/",function(req,res){
    res.render("landing");
});

//INDEX
app.get("/campgrounds",function(req,res){
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
app.post("/campgrounds",function(req,res){
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
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new") //form page
});

//SHOW 
app.get("/campgrounds/:id",function(req,res){
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


//========================
//    COMMENTS ROUTES
//========================


app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
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

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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
    //create comment for that campground
    //connect to comment model
    //redirect to show page
})

//==============================================
  //AUTH ROUTES
//==============================================

//show register form
app.get("/register",function(req,res){
     res.render("register");
});

//handle sign up form
app.post("/register",function(req,res){
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
//middleware
app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    
    }) , function(req,res){
})

//logout route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})

//middleware isLoggedIn 
function isLoggedIn(req , res , next){
    if(req.isAuthenticated() == true){
        return next();
    }
     res.redirect("/login");
}

app.listen(3000,function(req,res){
    console.log("YelpCamp Server Started");
})