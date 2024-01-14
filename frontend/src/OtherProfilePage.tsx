import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router";
import Card from 'react-bootstrap/Card';

export default function OtherProfilePage() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [profile, setProfile] = useState({
        username: "",
        password: "",
        profile_name: '',
        about_section: '',
        imageURL: '',
        friends: [],
    });

    const [user, setUser] = useState({
        username: "",
        password: "",
        profile_name: '',
        about_section: '',
        imageURL: '',
        friends: [],
    });

    const [userId, setUserId] = useState('');
    const [friendId, setFriendId] = useState();
    const [isFriend, setIsFriend] = useState(false);

    const [allPosts, setAllPosts] = useState([{
        user: {},
        title: '',
        content: '',
    }]);

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

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:3000/users/user/659c80cee0f47de5e6b2faff');
            // console.log(response.status, response.data)
            setUser(response.data);
            setUserId(response.data._id)
            // console.log(response.data)
            // Check if friendId is already in the friends array 
            if (response.data.friends.findIndex((friend: any) => friend._id === friendId) > -1) {
                setIsFriend(true);
            }
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getUser()
    }, [profile]);

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
                                    <Card id='posts-card'>
                                        <Card.Body>
                                            <Card.Title>{userPost.title}</Card.Title>
                                            <Card.Text>
                                                {userPost.content}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </Row>
            </Row>
        </>
    )
}