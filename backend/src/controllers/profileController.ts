import User from "../models/userModel.ts";
import Profile from "../models/profileModel.ts";
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

//GET profile details
export function profile_details_get() {
    return asyncHandler(async (req, res, next) => {
        const profile = await Profile.findById(req.params.id).exec();
        // console.log(user)
        console.log(profile.about_section)
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
                friends: req.body.friends,
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

//edit profile details
export function profile_details_edit() {
    return [
        //validate and sanitize fields
        body("profile_name", "Profile name is required.")
        .trim()
        .isLength({ min: 1 })
        .isLength({ max: 25 })
        .escape(),
    body("about_section")
        .trim()
        .isLength({ max: 300 })
        .escape(),
    body("imageURL")
        .trim()
        .escape(),

        asyncHandler(async (req, res, next) => {
            //take out validation errors from the request
            const errors = validationResult(req);

            //check for errors
            if (!errors.isEmpty()) {
                //take staff information from the form
                errors.array()
                console.log(errors)
                res.json(errors)
            } else {
                //find the staff member and update
                const profileDetailsUpdate = await Profile.findByIdAndUpdate(req.params.id, { profile_name: req.body.profile_name, about_section: req.body.about_section, imageURL: req.body.imageURL, friends: req.body.friends }, { new: true }).exec()
                //save profile update
                console.log(profileDetailsUpdate)
                res.json(profileDetailsUpdate)
            }
        })
    ]
}

//delete contact form submission
export function profile_delete() {
    return asyncHandler(async (req, res, next) => {
        const profileDelete = await Profile.findByIdAndDelete(req.params.id).exec();
        console.log("item deleted");
        res.json("item deleted");
    })
}