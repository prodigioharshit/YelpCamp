var  mongoose = require('mongoose'),
     Campground = require('./models/campgrounds.js'),
     Comment = require('./models/comment');

var data = [
      {name:"Water Bridge",
       image:"https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?cs=srgb&dl=seaport-during-daytime-132037.jpg&fm=jpg",
       description:"Wooden Bridge over a lake"
      },
      {
        name:"Mountain Pathway",
       image:"https://images.pexels.com/photos/2082949/pexels-photo-2082949.jpeg?cs=srgb&dl=high-angle-photography-of-mountain-pathway-2082949.jpg&fm=jpg",
       description:"Pathway across green mountains"
      },
      {
        name:"Lonely Tree",
       image:"https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?cs=srgb&dl=flight-landscape-nature-sky-36717.jpg&fm=jpg",
       description:"flight landscape nature sky"
      }
]

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great",
                                author: "Tony"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
        

module.exports = seedDB;
