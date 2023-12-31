import User from "../models/userModel.ts";
import Profile from "../models/profileModel.ts";
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

//GET profile details
export function profile_details_get() {
    return asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.params.id).exec();
        const profile = await Profile.findOne({ user: req.body.username }).exec();
        console.log(user)
        console.log(profile);
        res.json(profile);
    })
}

//Create profile details
export function profile_details_create() {

    return [
        body("profile_name", "Profile name is required.")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 25 })
            .escape(),
        body("about_section")
            .trim()
            .isLength({ max: 250 })
            .escape(),
        body("imageURL")
            .trim()
            .escape(),

        asyncHandler(async (req, res, next) => {
            const errors = validationResult(req);

            const profileDetails = new Profile({
                user: "6591f5e018252d4fa589528c",
                profile_name: req.body.profile_name,
                about_section: req.body.about_section,
                imageURL: req.body.imageURL,
            });

            if (!errors.isEmpty()) {
                errors.array();
                res.json(errors);
                console.log(errors)
            } else {
                console.log(profileDetails);
                res.json(await profileDetails.save());
            };
        })
    ];
};