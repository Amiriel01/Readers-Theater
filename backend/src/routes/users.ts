import {Router} from "express";
const router = Router();
import passport from 'passport';
import { user_list, user_get, user_create, user_details_edit, user_delete } from "../controllers/userController.ts";

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
