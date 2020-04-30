var mongoose = require('mongoose');

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

var Campground = mongoose.model("Campground" , campgroundSchema);//important
module.exports = Campground;