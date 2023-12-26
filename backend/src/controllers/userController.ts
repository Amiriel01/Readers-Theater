import { body, validationResult } from 'express-validator';
import User from "../models/userModel.ts";
import asyncHandler from "express-async-handler";

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
        body("passwrd", "Password cannot be blank.")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 100 })
            .escape(),
        body("profile_name", "Profile name cannot be blank.")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 25 })
            .escape(),
        body("about_section")
            .trim()
            .isLength({ max: 250 })
            .escape(),


        asyncHandler(async (req, res, next) => {
            //take out validation errors from the request
            const errors = validationResult(req);

            //create user object with escaped and trimmed info
            const user = new User({
                username: req.body.username,
                password: req.body.password,
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