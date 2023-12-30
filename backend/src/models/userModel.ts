import mongoose from "mongoose";
const Schema = mongoose.Schema;
// import passportLocalMongoose from 'passport-local-mongoose';

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
})

// UserSchema.plugin(passportLocalMongoose);

// UserSchema.methods.authenticate = function (password) {
//     return this.password === this.hashPassword(password);
// }

// UserSchema.methods.authenticate = function(password) {      
//     return this.password === password;
//   }

export default mongoose.model("User", UserSchema);