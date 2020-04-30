var express = require('express'),
      app    = express(),
    mongoose = require('mongoose');
    Campground = require('./models/campgrounds.js');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/Yelp");
app.set("view engine","ejs");  

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));



// Campground.create(
//     {
//         name: "Yellow Stone National Park",
//         image:"https://images.pexels.com/photos/267075/pexels-photo-267075.jpeg?cs=srgb&dl=bunsen-peak-clouds-cold-country-267075.jpg&fm=jpg",
//         description: "Largest Natural park..kind of like a reservoir for reservoir for research...One of the best places to      watch night sky"
        
//     } , function(err , camp){
//          if(err){
//              console.log("Error!");
//              console.log(err);
//          }
//         else{
//              console.log("Newly Created Campground");
//              console.log(camp);
//         }
// });


//global array
// var campgrounds = [ 
//     {name : "Grand Canyon",image:"https://www.photosforclass.com/download/pixabay-2005853?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e0d5464257af14f6da8c7dda793f7f1636dfe2564c704c7d287fd5954fc75a_1280.jpg&user=272447"} ,
//     {name: "Rocky's",image:"https://www.photosforclass.com/download/pixabay-1845947?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1464356ab14f6da8c7dda793f7f1636dfe2564c704c7d287fd5954ec45b_1280.jpg&user=Pexels"},
//     {name: "Yellow Stone",image:"https://www.photosforclass.com/download/pixabay-59605?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F53e9d3434f4fad0bffd8992ccf2934771438dbf85254794e712e79d09448_1280.jpg&user=ArtTower"}
    
// ]

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

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id , function(err , foundCamp){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{campground : foundCamp});
        }
    })
    //res.send("This will be show page one day");
    
});

app.listen(3000,function(req,res){
    console.log("YelpCamp Server Started");
})