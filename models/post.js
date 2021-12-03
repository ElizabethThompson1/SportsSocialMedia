const Joi = require('joi');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        text: { type: String, required: true},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0},
        
    }
)

const Post = mongoose.model('Post', userSchema);

function validationOfUser(Post){
    const schema = Joi.object({
        userId: Joi.string().min(2).max(500).required(),
        text: Joi.string().required(),
        likes: Joi.number(),
        dislikes: Joi.number(),
        
    })
        return schema.validate(User);        
}

exports.validateUser = validationOfUser;
exports.Post = Post;