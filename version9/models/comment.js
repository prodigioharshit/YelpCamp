var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
      text:"String",
      author:{                           //author as an object
          id:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"User"  //model that we are going to refer
          },
          username:"String"
      }
});

var Comment = mongoose.model("Comment",commentSchema);
module.exports = Comment;