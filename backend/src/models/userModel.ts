import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 25,
    },
    password: {
        type: String,
        required: true,
        maxLength: 100,
    },
    profile_name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 25,
    },
    about_section: {
        type: String,
        maxLength: 250,
    }
})

export default mongoose.model("User", UserSchema);