import { body, validationResult } from 'express-validator';
import User from "../models/userModel.ts";
import Post from '../models/postModel.ts';
import asyncHandler from "express-async-handler";
import PostDTO from '../dataTranserObjects/postDTO.ts';
import Like from '../models/likeModel.ts';
import he from 'he';

//GET a list of all posts and likes
export function posts_list() {
    return asyncHandler(async (req, res, next) => {
        const postsList = await Post.find().populate('user').populate('likes').exec();
        //bad code below, don't do this. Makes lots of database queries. 
        const PostDTOList = await Promise.all( postsList.map(async (post) => {
            return new PostDTO(
                post, 
                await Like.countDocuments({ post: post }).exec(),
                await Like.exists({ user: req.user, post: post }).exec() != null,
            )
        }));
        // console.log(PostDTOList);
        // console.log(req.user)
        res.json(PostDTOList);
    });
};

//GET single post 
export function post_details() {
    return asyncHandler(async (req, res, next) => {
        const postDetails = await Post.findById(req.params.id).populate('user').exec();
        // console.log(postDetails);
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
        body("content", "Content cannot be blank.")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 250 })
            .escape(),

        asyncHandler(async (req, res, next) => {
            //take out validation errors from the request
            const errors = validationResult(req);

            //create user object with escaped and trimmed info
            const post = new Post({
                title: he.decode(req.body.title),
                content: he.decode(req.body.content),
                // user: req.user,
                user: (req.user as any)._id,
            });

            //check for errors
            if (!errors.isEmpty()) {
                //take staff information from the form
                errors.array();
                console.log(errors);
                res.json(post);
            } else {
                //form data is valid, save the staff member
                // console.log(post);
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
        body("content", "Content cannot be blank.")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 250 })
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
                    title: he.decode(req.body.title),
                    content: he.decode(req.body.content),
                    // 
                    user: (req.user as any)._id,
                }, { new: true }).exec()
                //save profile update
                // console.log(postUpdate)
                res.json(postUpdate)
            }
        })
    ]
}

//DELETE post
export function post_delete() {
    return asyncHandler(async (req, res, next) => {
        const postDelete = await Post.findByIdAndDelete(req.params.id).exec();
        // console.log("item deleted");
        res.status(200).json(await Post.find().populate('user').exec());
    })
};