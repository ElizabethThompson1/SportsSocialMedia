const Joi = require('joi');
const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
            desc:{
                type:String,
                max:500,
            },
            img:{
                type:String,
            },
            like: {
                type:Array,
                default: [],
            }     
     },
            { timestamps: true }  
    );
   

module.exports.postSchema = postSchema;
module.exports.Post = mongoose.model("Post", postSchema);