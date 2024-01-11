import { body, validationResult } from 'express-validator';
import User from "../models/userModel.ts";
import Post from '../models/postModel.ts';
import asyncHandler from "express-async-handler";

//GET a list of all posts 
export function posts_list() {
    return asyncHandler(async (req, res, next) => {
        const postsList = await Post.find().populate('user').exec();
        console.log(postsList);
        res.json(postsList);
    });
};

//GET single post 
export function post_details() {
    return asyncHandler(async (req, res, next) => {
        const postDetails = await Post.findById(req.params.id).populate('user').exec();
        console.log(postDetails);
        res.json(postDetails);
    });
};

//POST a post
export function post_create() {
    return [
        //validate and sanitize fields
        body("title", "Title cannot be blank")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 25 })
            .escape(),
        body("post", "Post cannot be blank.")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 500 })
            .escape(),

        asyncHandler(async (req, res, next) => {
            //take out validation errors from the request
            const errors = validationResult(req);

            //create user object with escaped and trimmed info
            const post = new Post({
                title: req.body.title,
                post: req.body.post,
                user: req.body.user,
            });

            //check for errors
            if (!errors.isEmpty()) {
                //take staff information from the form
                errors.array();
                console.log(errors);
                res.json(post);
            } else {
                //form data is valid, save the staff member
                console.log(post);
                res.json(await post.save());
            };
        })
    ];
};

//PUT post details
export function post_edit() {
    return [
        //validate and sanitize fields
        body("title", "Title cannot be blank")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 25 })
            .escape(),
        body("post", "Post cannot be blank.")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 500 })
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
                const postUpdate = await Post.findByIdAndUpdate(req.params.id, {
                    title: req.body.title,
                    post: req.body.post,
                    user: req.body.user
                }, { new: true }).exec()
                //save profile update
                console.log(postUpdate)
                res.json(postUpdate)
            }
        })
    ]
}

//DELETE post
export function post_delete() {
    return asyncHandler(async (req, res, next) => {
        const postDelete = await Post.findByIdAndDelete(req.params.id).exec();
        console.log("item deleted");
        res.json("item deleted");
    })
};