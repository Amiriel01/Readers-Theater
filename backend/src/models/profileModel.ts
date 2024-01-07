import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    profile_name: {
        type: String,
        required: true,
        maxLength: 25,
    },
    about_section: {
        type: String,
        required: true,
        maxLength: 250,
    },
    imageURL: {
        type: String,
        required: true,
    },
    friends: {
        type: Array,
        default: [],
    },
})

export default mongoose.model("Profile", ProfileSchema);