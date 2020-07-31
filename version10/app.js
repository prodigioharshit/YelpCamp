var express         = require('express'),
    app             = express(),
    mongoose        = require('mongoose'), 
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require('method-override'),
    User            = require('./models/user'),
    Campground      = require('./models/campgrounds.js'),
    Comment         = require('./models/comment.js'),
    seedDB          = require("./seeds");

var commentRoutes       =  require('./routes/comments.js'),
    campgroundRoutes    =  require('./routes/campgrounds.js'),
    authRoutes          =  require('./routes/auth.js');       

//seedDB(); //seed the database

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);  
mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost/Yelp");
app.set("view engine","ejs");  

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public")) //__dirname gives path of current working directory
app.use(methodOverride("_method")); // method override

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
    res.locals.currentUser = req.user; //passport will provide logged in info about acurrent user to every route.
    next();
});

//connecting routes
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);// in router {mergeParams:true}
app.use(authRoutes); //no common routes

app.listen(3000,function(req,res){
    console.log("YelpCamp Server Started");
})