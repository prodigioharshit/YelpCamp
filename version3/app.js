var express = require('express'),
      app    = express(),
    mongoose = require('mongoose'),
    Campground = require('./models/campgrounds.js'),
        seedDB = require("./seeds");

//seedDB();

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/Yelp");
app.set("view engine","ejs");  

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));



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
            res.render("index",{Campgrounds : allcampgrounds});
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
    res.render("new") //form page
});

//SHOW 
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err , foundCamp){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCamp);
            res.render("show",{campground : foundCamp});
        }
    })
    //res.send("This will be show page one day");
});

app.listen(3000,function(req,res){
    console.log("YelpCamp Server Started");
})