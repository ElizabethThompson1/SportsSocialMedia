const { User, validateLogin, validateUser, FriendRequest } = require("../models/user");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

//* POST register a new user
router.post("/register", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send(`Email ${req.body.email} already claimed!`);

    const salt = await bcrypt.genSalt(10);
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      isAdmin: req.body.isAdmin,
    });

    await user.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
//* POST a valid login attempt
//! when a user logs in, a new JWT token is generated and sent if their email/password credentials are correct
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) 
      return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send(`Invalid email or password.`);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// We need an endpoint that makes a firend request for a spcific user
//

router.post('/friends/:userToBefriendId/request', [auth], async (req, res) => {
  const signedInUser = await User.findById(req.user._id);

  const userToBefriend = await User.findById(req.params.userToBefriendId);

  const friendRequest = new FriendRequest({
    friendId: signedInUser._id
  });

  userToBefriend.friends.push(friendRequest);

  await userToBefriend.save()

  return res.send(userToBefriend);

});

router.put("/friends/:userToBefriendId/request", [auth], async (req, res) => {
  try {
    const signedInUser = await User.findById(req.user._id);

    let friendRequest = signedInUser.FriendRequest.id(req.params.userToBefriendId);

    friendRequest.status = 'ACCEPTED';

    await signedInUser.save()

    return res.send(friend);
    
  } catch (err) {
      res.status(500).json(err);
}
}); 


router.put("/friends/:userToBefriendId/request", [auth], async (req, res) => {
  try {
    const signedInUser = await User.findById(req.user._id);

    let friendRequest = signedInUser.FriendRequest.id(req.params.userToBefriendId);

    friendRequest.status = 'DECLINED';

    await signedInUser.save()

    return res.send(friend);
    
  } catch (err) {
      res.status(500).json(err);
}
}); 




// router.put("/:userId/follow" , async (req, res)=>{
//   if (req.body.userId !== req.params.userId){
//     try{
//       const userToFollow = await User.findById(req.params.userId);
//       const currentUser = await User.findById(req.body.userId);
//       if (!userToFollow || !currentUser){
//         console.log(" error, user doesn't exist")
//       }

//       currentUser.friends.push(userToFollow._id);
//       userToFollow.friends.push(currentUser._id);
//       await currentUser.save();
//       await userToFollow.save();
//       return res.send([currentUser,userToFollow]);
      
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(403).json("you cannot follow yourself");
//   }
// });

// router.put("/:userId/unfollow" , async (req, res)=>{
//   if (req.body.userId !== req.params.userId){
//     try{
//       const userToUnFollow = await User.findById(req.params.userId);
//       const currentUser = await User.findById(req.body.userId);
//       if (!userToUnFollow || !currentUser){
//       console.log("you're not following the user")
//       }

//       currentUser.friends.remove(userToUnFollow._id);
//       await currentUser.save();
//       return res.send(currentUser);
      
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(403).json("you cannot follow yourself");
//   }
// });
//* Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* DELETE a single user from the database
router.delete("/:userId", [auth], async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    await user.remove();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
