const router = require('express').Router();
const {Post} = require("../models/Post");
const { User } = require('../models/user');
const auth = require('../middleware/auth');


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


// /api/posts/iojsadfjil89f4j9f8oj

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

// router.delete("/:id", async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (post.userId === req.body.userId) {
//             await post.updateOne( {$set:req.body});
//             res.status(200).json("the post has been updated");
            
        
//         } else {
//             res.status(403).json("you can update only your post");
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


module.exports = router;