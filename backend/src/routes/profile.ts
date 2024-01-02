import {Router} from "express";
const router = Router();
import { profile_details_get, profile_details_create, profile_details_edit, profile_delete } from "../controllers/profileController.ts";

//GET user profile details
router.get("/profile_details/:id", profile_details_get());

//POST profile details create
router.post("/profile_details", profile_details_create());

//PUT edit profile details
router.put("/profile_details/:id", profile_details_edit());

//DELETE profile
router.delete("/profile_details/:id", profile_delete());

export default router;