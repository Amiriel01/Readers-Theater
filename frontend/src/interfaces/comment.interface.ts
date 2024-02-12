import { PostInterface } from "./post.interface";
import { UserInterface } from "./user.interface";

export interface CommentInterface {
    user: UserInterface;
    post: PostInterface;
    comment_text: string,
    _id: string,
}
