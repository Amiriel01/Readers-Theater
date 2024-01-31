import Like from "../models/likeModel.ts";
import asyncHandler from "express-async-handler";
import Post from '../models/postModel.ts';

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

    console.log("User ID from request body:", req.body.userId);
    console.log("Post ID from request params:", req.params.id);

    // let newLike;

    if (existingLikes.length > 0) {
        // Assuming there's only one matching like, use findOneAndDelete
        const existingLike = existingLikes[0];

        console.log("Deleting existing like:", existingLike);
        await Like.findOneAndDelete({ _id: existingLike._id }).exec();

        // Remove the like from the post's likes array
        post.likes = post.likes.filter(likeId => likeId.toString() !== existingLike._id.toString());
    } else {
        // User has not liked the post, like it
        const newLike = new Like({
            user: req.body.userId,
            post: req.params.id,
        });
        console.log("Creating new like:", newLike);
        await newLike.save();
        post.likes.push(newLike._id);
    }

    // if (existingLike) {
    //     // User has already liked the post, unlike it
    //     console.log("Deleting existing like:", existingLike);
    //     await Like.findOneAndDelete({ _id: existingLike._id }).exec();
    //     // Remove the like from the post's likes array
    //     post.likes = post.likes.filter(likeId => likeId.toString() !== existingLike._id.toString());
    // } else {
    //     // User has not liked the post, like it
    //     const newLike = new Like({
    //         user: req.body.userId,
    //         post: req.params.id,
    //     });
    //     console.log("Creating new like:", newLike);
    //     await newLike.save();
    //     post.likes.push(newLike._id);
    // };

    const responseData = {
        post: post,
        // like_count: await Like.countDocuments({ post: req.params.id }),
        like_count: post.likes.length,
    };
    // console.log(responseData)
    res.json(responseData);
});