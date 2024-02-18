import Like from "../models/likeModel";
import asyncHandler from "express-async-handler";
import Post from '../models/postModel';

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
    const existingLikes = await Like.find({ user: req.body.userId, post: req.params.id }).exec();

    if (existingLikes.length > 0) {
        // if only one match use findOneAndDelete
        const existingLike = existingLikes[0];

        await Like.findOneAndDelete({ _id: existingLike._id }).exec();

        // Remove the like from the post's likes array
        post.likes = post.likes.filter(likeId => likeId.toString() !== existingLike._id.toString());
    } else {
        // User has not liked the post yet, this will create a new like
        const newLike = new Like({
            user: req.body.userId,
            post: req.params.id,
        });
        await newLike.save();
        post.likes.push(newLike._id);
    }

     // Save the updated post back to the database
     await post.save();

    const responseData = {
        post: post,
        like_count: post.likes.length,
    };

    res.json(responseData);
});