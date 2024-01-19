import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router";
import Card from 'react-bootstrap/Card';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import Comment from './MyComment';
import MyButton from './MyButton';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default function OtherProfilePage({ user, setUser, userId, setUserId }) {

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
        friends: [],
    });

    const [friendId, setFriendId] = useState();
    const [isFriend, setIsFriend] = useState(false);

    const [allPosts, setAllPosts] = useState([{
        user: {},
        title: '',
        content: '',
    }]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname]);

    const handleToggleCommentForm = (postId) => {
        setCommentVisibility((prevVisibility) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
        }));
    };

    async function getProfile() {
        try {
            const response = await axios.get(`http://localhost:3000/users/user/${id}`);
            // console.log(response.status, response.data)
            setProfile(response.data);
            setFriendId(response.data._id);

        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        getProfile();
    }, [id]);

    const handleFriendButtonClick = async (event, userId, friendId, isFriend) => {
        try {
            if (isFriend) {
                // Delete friend
                const followerDeleteResponse = await axios.delete("http://localhost:3000/users/deleteFriend", { data: { userId, friendId } });
                setIsFriend(false);
                setUser(followerDeleteResponse.data);
            } else {
                // Add friend
                const followerAddData = await axios.put('http://localhost:3000/users/addFriend', { userId, friendId });
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
            console.log(response.status, response.data)
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
                            <img id='profile-image' src={`http://localhost:3000/public/${profile.imageURL}`}></img>
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
                        <div id='following-card-container'>
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
                                    <div id='post-comment-container'>
                                        <Card id='posts-card'>
                                            <Card.Body>
                                                <div id='post-flex-container'>
                                                    <img id='post-image-thumbnail' src={`http://localhost:3000/public/${userPost.user.imageURL}`}></img>
                                                    <div>
                                                        <Card.Title>{userPost.title}</Card.Title>
                                                        <Card.Text>
                                                            {userPost.content}
                                                        </Card.Text>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                            <div id='post-buttons-container'>
                                                <MyButton
                                                    id='comment-button'
                                                    title='Comments'
                                                    onClick={() => handleToggleCommentForm(userPost._id)}
                                                ></MyButton>
                                            </div>
                                        </Card>
                                        {commentVisibility[userPost._id] && (
                                            <Comment user={user} post={userPost} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Row>
            </Row>
        </>
    )
}