import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

interface UserDocument extends Document {
  username: string;
  password: string;
  profile_name: string;
  about_section: string;
  imageURL: string;
  friends: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
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
    maxLength: 25,
  },
  about_section: {
    type: String,
    required: true,
    maxLength: 300,
  },
  imageURL: {
    type: String,
    required: true,
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
});

export default mongoose.model<UserDocument>("User", UserSchema);



