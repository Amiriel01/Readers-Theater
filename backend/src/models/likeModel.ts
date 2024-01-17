import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    like: {
        type: Boolean,
        default: false,
    }
});

export default mongoose.model("Like", LikeSchema);