//Define the user interface
export interface UserInterface {
    _id: string;
    username: string,
    profile_name: string,
    about_section: string,
    imageURL: string | null,
    friends: Array<UserInterface>,
}

