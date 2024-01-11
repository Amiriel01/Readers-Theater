import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        minLength: 1,
        maxLength: 25,
    },
    post: {
        type: String,
        minLength: 1,
        maxLength: 500,
    }
});

export default mongoose.model("Post", PostSchema);