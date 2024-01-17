import Like from "../models/likeModel.ts";
import asyncHandler from "express-async-handler";
import Post from '../models/postModel.ts';

// Like a post
export const like_post = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;

    // Find the post
    const post = await Post.findById(postId).exec();

    // Check if the post exists
    if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
    }

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ user: req.body.user, post: postId }).exec();

    if (existingLike) {
        // User has already liked the post, unlike it
        await Like.findByIdAndDelete(existingLike._id).exec();
        post.like_count -= 1;
    } else {
        // User has not liked the post, like it
        const newLike = new Like({
            user: req.body.user,
            post: postId,
            like: true,
        });
        await newLike.save();
        post.like_count += 1;
    }

    // Save the updated post
    const updatedPost = await post.save();

    res.json(updatedPost);
});