import Like from "../models/likeModel.ts";
import asyncHandler from "express-async-handler";
import Post from '../models/postModel.ts';

// //GET a list of all posts 
// export function likes_list() {
//     return asyncHandler(async (req, res, next) => {
//         const likesList = await Like.find().populate('user').populate('post').exec();
//         console.log(likesList);
//         res.json(likesList);
//     });
// };

// Like a post
export const like_post = asyncHandler(async (req, res, next) => {

    // Find the post
    const post = await Post.findById(req.params.id).exec();

    // Check if the post exists
    if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
    }

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ user: req.body.user, post: req.params.id }).exec();

    let newLike;

    if (existingLike) {
        // User has already liked the post, unlike it
        await Like.findByIdAndDelete(existingLike._id).exec();
    } else {
        // User has not liked the post, like it
        const newLike = new Like({
            user: req.user,
            post: req.params.id,
        });
        await newLike.save();
    };

    const responseData = {
        post: post,
        like: null || newLike,
        like_count: await Like.countDocuments({ post: req.params.id }),
    };

    res.json(responseData);
});