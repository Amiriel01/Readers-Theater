import axios from '../../utility/axios.js';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router";
import Card from 'react-bootstrap/Card';
import Header from '../../components/SiteLayout/Header';
import { useLocation } from 'react-router-dom';
import Post from '../../components/post/Post';
import { UserInterface, UserModel } from '../../interfaces/user.interface.js';
import { PostInterface } from '../../interfaces/post.interface.js';

//Define interface for OtherProfilePage
interface OtherProfilePageProps {
    user: UserInterface;
    setUser: React.Dispatch<React.SetStateAction<UserInterface>>;
    userId: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
}

export default function OtherProfilePage({ user, setUser, userId, setUserId }: OtherProfilePageProps) {

    const navigate = useNavigate();
    const { id } = useParams();
    const { pathname } = useLocation();
    const [commentVisibility, setCommentVisibility] = useState({});

    const [profile, setProfile] = useState({
        username: "",
        password: "",
        profile_name: '',
        about_section: '',
        imageURL: '',
        friends: [{
            _id: '',
            profile_name: '',
            imageURL: '',
        }],
    });

    const [friendId, setFriendId] = useState("");
    const [isFriend, setIsFriend] = useState(false);

    const [allPosts, setAllPosts] = useState<Array<PostInterface>>([]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname]);

    const handleToggleCommentForm = (postId: string) => {
        //preVisibility's keys are strings, and values are boolean.Record is a utility type that represents this.
        setCommentVisibility((prevVisibility: Record<string, boolean>) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
        }));
    };

    async function getProfile() {
        try {
            const response = await axios.get(`http://localhost:3000/users/user/${id}`);
            setProfile(response.data);
            setFriendId(response.data._id);

            // Check if the logged-in user is a friend of the profile user
            //define they type of the friend parameter as an object with an _id property type of string.
            const isFriend = response.data.friends.some((friend: { _id: string }) => friend._id === user._id);
            setIsFriend(isFriend);

        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getProfile();
    }, [id]);

    const handleFriendButtonClick = async (event: React.MouseEvent<HTMLButtonElement>, userId: string, friendId: string, isFriend: boolean) => {
        try {
            if (isFriend) {
                // Delete friend
                const followerDeleteResponse = await axios.delete("http://localhost:3000/users/deleteFriend", { data: { userId: user._id, friendId } });
                setIsFriend(false);
                setUser(followerDeleteResponse.data);
            } else {
                // Add friend
                const followerAddData = await axios.put('http://localhost:3000/users/addFriend', { userId: user._id, friendId });
                setIsFriend(true);
                setUser(followerAddData.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getAllPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/posts/postsList');
            setAllPosts(response.data);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getAllPosts();
    }, []);

    return (
        <>
            <Header />
            <Row id='profile-page-container'>
                <Row id='profile-page-information-container'>
                    <Row id='profile-information-container'>
                        <Col lg={4} id='profile-image-container'>
                            <img id='profile-image' src={`http://localhost:3000/public/${profile.imageURL}`} alt='user profile image'></img>
                            <button id='delete-user-button' onClick={(event) => handleFriendButtonClick(event, userId, friendId, isFriend)}>
                                {isFriend ? 'Unfollow' : 'Follow'}
                            </button>
                        </Col>
                        <Col lg={6}>
                            <div id='profile-name-container'>
                                <Row>
                                    <Col id='profile-name-label'>
                                        Public Profile Name:
                                    </Col>
                                </Row>
                                <Row>
                                    <Col id='profile-name-info'>
                                        {profile.profile_name}
                                    </Col>
                                </Row>
                            </div>
                            <div id='profile-about-container'>
                                <Row>
                                    <Col id='profile-about-label'>
                                        About Me:
                                    </Col>
                                </Row>
                                <Row>
                                    <Col id='profile-about-info'>
                                        {profile.about_section}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Row>
                <Row id='following-posts-container'>
                    <div id='following-container'>
                        <Row>
                            <Col id='following-title'>
                                Followed Readers
                            </Col>
                        </Row>
                        <div id='following-cards-container'>
                            {profile.friends.map((friend, index) => {
                                return <Link to={"/users/user/" + friend._id} key={index} id='following-link'>
                                    <Card id='following-card'>
                                        <img className='following-image' src={`http://localhost:3000/public/${friend.imageURL}`}></img>
                                        <Card.Body>
                                            <Card.Title>{friend.profile_name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            })}
                        </div>
                    </div>
                    <div id='posts-container'>
                        <div id='finished-posts'>
                            <Row>
                                <Col className='posts-title'>
                                    {profile.profile_name}'s Posts
                                </Col>
                            </Row>
                            {allPosts.filter(postUser => postUser.user._id === friendId).map((userPost) => (
                                <div key={userPost._id}>
                                    <Post
                                        user={user}
                                        friendId={friendId}
                                        userPost={userPost}
                                        commentVisibility={commentVisibility}
                                        handleToggleCommentForm={handleToggleCommentForm}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Row>
            </Row>
        </>
    )
}