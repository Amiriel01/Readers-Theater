import { Router } from "express";
const router = Router();
import { posts_list, post_details, post_create, post_edit, post_delete } from "../controllers/postController.ts";
import { like_post } from "../controllers/likeController.ts";
import passport from "passport";

router.use((req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            // Forward any passport-related errors to the error handler
            return next(err); 
        }

        if (!user) {
            // If there is no user, return an error
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // If there is a user, proceed to the next middleware
        return next();
    })(req, res, next);
});


//Post Likes
router.post('/postDetails/:id/like', like_post);

//GET posts list
router.get("/postsList", posts_list());
// router.get("/postsList", passport.authenticate('jwt', {session: false}), posts_list());

//GET single post details
router.get("/postDetails/:id", post_details());

//POST create post
router.post('/postCreate', post_create());

//PUT edit post
router.put('/postDetails/:id', post_edit());

//DELETE delete post
router.delete('/postDetails/:id', post_delete());

export default router;