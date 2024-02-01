import Post from '../models/postModel.ts';

export default class PostDTO {
    _id: string;
    user: any;
    title: string;
    content: string;
    likes: number;
    isLiked: boolean;

    constructor(post: any, likes: number, isLiked: boolean) {
        this._id = post._id;
        this.user = post.user;
        this.title = post.title;
        this.content = post.content;
        this.likes = likes;
        this.isLiked = isLiked;
    }
}