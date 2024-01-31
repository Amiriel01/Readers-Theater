import {Router} from "express";
const router = Router();
import { comment_list, comment_details, comment_create, comment_edit, comment_delete } from "../controllers/commentController.ts";
import passport from "passport";

// router.use((req, res, next) => {
//     passport.authenticate('jwt', { session: false }, (err, user, info) => {
//         if (err) {
//             // Forward any passport-related errors to the error handler
//             return next(err); 
//         }

//         if (!user) {
//             // If there is no user, return an error
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         // If there is a user, proceed to the next middleware
//         return next();
//     })(req, res, next);
// });

//GET comment list
router.get("/commentList", comment_list());

//GET single comment details
router.get("/commentDetails/:id", comment_details());

//POST create comment
router.post('/commentCreate', comment_create());

//PUT edit comment
router.put('/commentDetails/:id', comment_edit());

//DELETE delete comment
router.delete('/commentDetails/:id', comment_delete());

export default router;