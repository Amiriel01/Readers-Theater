import mongoose, { Document } from "mongoose";
import Post from "./postModel.ts";
import Comment from "./commentModel.ts";

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

// // Custom method to delete a user along with associated posts and comments
// UserSchema.pre('deleteMany', async function (userId: mongoose.Types.ObjectId) {
//   try {

//     console.log('Deleting user with associations...');
//     // Remove posts and comments
//     const postDeletionResult = await Post.deleteMany({ user: userId } as any);
//     const commentDeletionResult = await Comment.deleteMany({ user: userId } as any);

//     console.log('Post deletion result:', postDeletionResult);
//     console.log('Comment deletion result:', commentDeletionResult);

//     // await Promise.all([
//     //   Post.deleteMany({ user: userId } as any),
//     //   Comment.deleteMany({ user: userId } as any),
//     // ]);

//     // Remove user
//     const user = await this.findByIdAndDelete(userId);

//     console.log('User deletion result:', user);

//     return user;
//   } catch (error) {
//     console.error('Error deleting user with associations:', error);
//     throw error;
//   }
// });

export default mongoose.model<UserDocument>("User", UserSchema);



