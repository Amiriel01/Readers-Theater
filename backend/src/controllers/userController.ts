import { body, validationResult } from 'express-validator';
import User from "../models/userModel.ts";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';

//GET a list of all users with details
export function user_list() {
    return asyncHandler(async (req, res, next) => {
        const userList = await User.find().exec();
        console.log(userList);
        res.json(userList);
    });
};

//GET single user with details
export function user_get() {
    return asyncHandler(async (req, res, next) => {
        const userDetails = await User.findById(req.params.id).exec();
        console.log(userDetails);
        res.json(userDetails);
    });
};

//POST user
export function user_create() {
    return [
        //validate and sanitize fields
        body("username", "Username cannot be blank")
            .trim()
            .isLength({ min: 1 })
            .escape(),
        body("password", "Password cannot be blank.")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 25 })
            .escape(),
        body("confirm_password", "Password cannot be blank.")
            .trim()
            .isLength({ min: 5 })
            .isLength({ max: 25 })
            .custom(async (confirmPassword, { req }) => {
                console.log(confirmPassword)
                const password = req.body.password
                console.log(password)
                if (password !== confirmPassword) {
                    throw new Error('Passwords must match.')
                }
                return true;
            })
            .escape(),
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
            //take out validation errors from the request
            const errors = validationResult(req);
            const hashPassword = await bcrypt.hashSync(req.body.password, 10);

            //create user object with escaped and trimmed info
            const user = new User({
                username: req.body.username,
                password: hashPassword,
                profile_name: req.body.profile_name,
                about_section: req.body.about_section,
                imageURL: req.body.imageURL,
                friends: req.body.friends,
            });

            //check for errors
            if (!errors.isEmpty()) {
                //take staff information from the form
                errors.array();
                console.log(errors);
                res.json(user);
            } else {
                //form data is valid, save the staff member
                console.log(user);
                res.json(await user.save());
            };
        })
    ];
};

//edit user details
export function user_details_edit() {
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
                const userDetailsUpdate = await User.findByIdAndUpdate(req.params.id, {
                    username: req.body.username,
                    password: req.body.password,
                    profile_name: req.body.profile_name,
                    about_section: req.body.about_section,
                    imageURL: req.body.imageURL,
                    friends: req.body.friends
                }, { new: true }).exec()
                //save profile update
                console.log(userDetailsUpdate)
                res.json(userDetailsUpdate)
            }
        })
    ]
}

//delete contact form submission
export function user_delete() {
    return asyncHandler(async (req, res, next) => {
        const userDelete = await User.findByIdAndDelete(req.params.id).exec();
        console.log("item deleted");
        res.json("item deleted");
    })
}