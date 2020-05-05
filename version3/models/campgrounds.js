var mongoose = require('mongoose');

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment" //name of the model
        }
    ]
});

var Campground = mongoose.model("Campground" , campgroundSchema);//important
module.exports = Campground;