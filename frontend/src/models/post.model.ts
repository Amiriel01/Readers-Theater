import { PostInterface } from "../interfaces/post.interface";
import { UserInterface } from "../interfaces/user.interface";
import { UserModel } from "./user.model";

export class PostModel implements PostInterface {
    user: UserInterface = new UserModel();
    title: string = '';
    content: string = '';
    _id: string = '';
    isLiked: boolean = false;
    likes: number = 0;
}