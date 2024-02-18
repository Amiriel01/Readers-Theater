import { body, validationResult } from 'express-validator';
import Comment from '../models/commentModel';
import asyncHandler from "express-async-handler";
import he from 'he';

//GET a list of all comments 
export function comment_list() {
    return asyncHandler(async (req, res, next) => {
        const commentsList = await Comment.find().populate('user').populate('post').exec();
        res.json(commentsList);
    });
};

//GET single comment 
export function comment_details() {
    return asyncHandler(async (req, res, next) => {
        const commentDetails = await Comment.findById(req.params.id).populate('user').populate('post').exec();
        res.json(commentDetails);
    });
};

//POST a comment
export function comment_create() {
    return [
        //validate and sanitize fields
        body("comment_text", "Comment text cannot be blank")
            .trim()
            .isLength({ min: 1 })
            .isLength({ max: 250 })
            .escape(),

        asyncHandler(async (req, res, next) => {
            //take out validation errors from the request
            const errors = validationResult(req);

            //create user object with escaped and trimmed info
            const comment = new Comment({
                user: (req.user as any)._id,
                post: req.body.post,
                comment_text: he.decode(req.body.comment_text),
            });

            //check for errors
            if (!errors.isEmpty()) {
                //take staff information from the form
                errors.array();
                res.json(comment);
            } else {
                //form data is valid, save the staff member
                res.json(await comment.save());
            };
        })
    ];
};

//PUT edit comment details
export function comment_edit() {
    return [
        //validate and sanitize fields
        body("comment_text", "Comment text cannot be blank")
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
                errors.array();
                res.json(errors);
            } else {
                //find the staff member and update
                const commentUpdate = await Comment.findByIdAndUpdate(req.params.id, {
                    user: (req.user as any)._id,
                    post: req.body.post,
                    comment_text: he.decode(req.body.comment_text),
                }, { new: true }).exec()
                //save profile update
                res.json(commentUpdate);
            }
        })
    ]
}

//DELETE post
export function comment_delete() {
    return asyncHandler(async (req, res, next) => {
        const commentDelete = await Comment.findByIdAndDelete(req.params.id).exec();
        res.status(200).json(await Comment.find().populate('user').populate('post').exec());
    })
};