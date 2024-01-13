import {Router} from "express";
const router = Router();
import { posts_list, post_details, post_create, post_edit, post_delete } from "../controllers/postController.ts";

//GET user list
router.get("/postsList", posts_list());

//GET single post details
router.get("/postDetails/:id", post_details());

//POST create post
router.post('/postCreate', post_create());

//PUT edit post
router.put('/postDetails/:id', post_edit());

//DELETE delete post
router.delete('/postDetails/:id', post_delete());

export default router;