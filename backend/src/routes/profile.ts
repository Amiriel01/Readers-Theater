import {Router} from "express";
const router = Router();
import { profile_details_get, profile_details_create } from "../controllers/profileController.ts";

//GET user profile details
router.get("/profile/:id", profile_details_get());

//POST user profile details create
router.post("/profile_create", profile_details_create());

export default router;