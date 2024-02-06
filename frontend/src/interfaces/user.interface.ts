//Define the user interface
export interface User {
    _id: string;
    username: string,
    profile_name: string,
    about_section: string,
    imageURL: string,
    friends: Array<User>,
}

