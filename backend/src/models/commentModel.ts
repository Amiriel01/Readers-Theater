import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    comment_text: {
        type: String,
        minLength: 1,
        maxLength: 250,
    }
});

export default mongoose.model("Comment", CommentSchema);