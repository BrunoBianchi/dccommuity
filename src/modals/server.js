const { Schema } = require("mongoose");
const mongoose = require("../database/database");
const shortid = require("shortid");
var htmlencode = require('htmlencode');
 const moment = require("moment")
const ServerSchema = new Schema({
  name: {
    type: String,
    require: true,
    lowercase: true,
  },
  icon:{
    type:String,
    require:true,
  },
  id: {
    type: String,
    unique: true,
    require: true,
  },
  premium: {
    type: Boolean,
    default: false,
    require: true,
  },
  tags:[{
    name:{
      type:String,
      require:true,
    }
  }],
  memberCount:{
    type:Number,
    default:0,
  },
  votes:{
    type:Number,
    default:0,
  },
  
  Users_votes:[{
    users:[{
      name:{
        type:String,
      },
      id:{
        type:String,
      },
      votes:{
        type:Number,
        default:0,
      },
      last_vote_date:{
        type: Date,
      }
    }]
  }],
  content:{
    type:String,
    require:true,
    default:"My Cool Server",
  },
  description:{
    type: String ,
    require:true,
    default: "'## h2 Heading'"
  },
  votes:{
    type:Number,
    require:true,
    default:0,
  },
  NSFW:{
    type:Boolean,
    default:false,
    require:true,
  },
  createdAt: {
    type: Date,
    default:Date.now,
    require: true,
  },
  lastBump: {
    type: Date,
    default: Date.now,
    require: true,
  },
  preferredLocale: {
    type:String,
    require:true,
  },
  invite: {
    type:String,
    require:true,
  }
});

const server = mongoose.model("servers", ServerSchema);
module.exports = server;