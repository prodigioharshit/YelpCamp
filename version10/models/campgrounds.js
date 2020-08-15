var mongoose = require('mongoose');

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment" //name of the model
        }
    ]
});

var Campground = mongoose.model("Campground" , campgroundSchema);//important
module.exports = Campground;