const router = require('express').Router();
const {Post} = require("../models/Post");
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const {friends} = require("./users");
const { startSession } = require('mongoose');



router.post("/", [auth], async (req,res)=>{
    try {
        const user = await User.findById(req.user._id);

        const newPost = new Post(req.body);

        user.posts.push(newPost);

        await user.save();

        return res.send(user);

    } catch (err) {
        res.status(500).json(err);
    }
});



router.put("/:postId", [auth], async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        let post = user.posts.id(req.params.postId);

        post = {...post, ...req.body};

        await user.save()

        return res.send(post);
        
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/:userId", [auth], async (req, res) => {
    const user = await User.findById(req.params.userId);
    await user.remove();
    return res.send(user);
});

router.put("/like", [auth], async (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
       $push:{likes:req.user._id}
    },{ 
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err })
        }else{
            res.json(result)
        }
    })
})
router.put("/unlike", [auth], async (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
       $pull:{likes:req.user._id}
    },{ 
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err })
        }else{
            res.json(result)
        }
    })
})


module.exports = router;

