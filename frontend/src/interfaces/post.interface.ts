import { UserInterface, UserModel } from "./user.interface";

//Define the post interface
export interface PostInterface {
    user: UserInterface,
    title: string,
    content: string,
    _id: string,
    isLiked: boolean,
    likes: number,
}

export class PostModel implements PostInterface {
    user: UserInterface = new UserModel();
    title: string = '';
    content: string = '';
    _id: string = '';
    isLiked: boolean = false;
    likes: number = 0;
}