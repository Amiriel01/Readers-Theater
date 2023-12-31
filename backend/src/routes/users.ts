import {Router} from "express";
const router = Router();
import passport from 'passport';
import { user_list, user_get, user_create } from "../controllers/userController.ts";
// import { profile_details_get, profile_details_create } from "../controllers/profileController.ts";

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

// //GET user profile details
// router.get("user/:id/profile", profile_details_get());

// //POST user profile details create
// router.post("user/:id/profile", profile_details_create());

//PUT user profile details edit
// router.put("user/:id/profile", profile_details_edit());

//Passport Login
router.post(
  "/login",
  passport.authenticate("jwt", {
    session: false,
  }),
  function (req, res) {
    console.log('something random')
    res.json(req.user)
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
