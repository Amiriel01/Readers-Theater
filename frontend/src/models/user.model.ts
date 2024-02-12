import { UserInterface } from "../interfaces/user.interface";

export class UserModel implements UserInterface {
    _id: string = '';
    username: string = '';
    profile_name: string = '';
    about_section: string = '';
    imageURL: string = '';
    friends: UserInterface[] = [];
}