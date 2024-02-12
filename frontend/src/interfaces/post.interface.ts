import { UserInterface } from "./user.interface";

//Define the post interface
export interface PostInterface {
    user: UserInterface,
    title: string,
    content: string,
    _id: string,
    isLiked: boolean,
    likes: number,
}

