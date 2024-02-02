import {Router} from "express";
const router = Router();
import passport from 'passport';
import { user_list, user_get, user_create, user_details_edit, user_delete, add_friend, delete_friend } from "../controllers/userController.ts";
// import {sign} from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import User from '../models/userModel.ts';

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//POST new user
router.post("/userCreate", user_create());

//GET user list
router.get("/userList", user_list());

//GET user details
router.get("/user/:id", user_get());

//PUT user details
router.put("/user/:id", user_details_edit());

//DELETE user 
router.delete("/user/:id", user_delete());

//POST Add Friend
router.put("/addFriend", add_friend());

//DELETE Delete Friend
router.delete("/deleteFriend", delete_friend());

router.post(
  "/login",
  passport.authenticate("local", {
    session: false,
  }),
  async function (req, res) {
    try {
      //populating the friends array with the friend objects not just the ids
      await User.populate(req.user, { path: "friends" });

      const token = jwt.sign(JSON.parse(JSON.stringify(req.user)), process.env.JWT_KEY);

      res.json({ user: req.user, token: token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Passport Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json("User Logged Out")
  });
});

export default router;
