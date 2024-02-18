import {Router} from "express";
const router = Router();
import { comment_list, comment_details, comment_create, comment_edit, comment_delete } from "../controllers/commentController";
import PassportAuth from '../utility/authentication';

router.use(PassportAuth);

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