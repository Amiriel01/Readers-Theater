import {Router} from "express";
const router = Router();
import passport from 'passport';
import { user_list, user_get, user_create } from "../controllers/userController.ts";

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//GET user list
router.get("/userList", user_list());

//GET user details
router.get("/user/:id", user_get());

//POST new user
router.post("/userCreate", user_create());

//Passport Login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login"
  }),
  function (req, res) {
    res.json(req.body.username)
  }
);

//Passport Logout
// router.get("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.json("User Logged Out")
//   });
// });

export default router;
