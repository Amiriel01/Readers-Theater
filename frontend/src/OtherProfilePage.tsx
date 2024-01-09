import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router";

export default function OtherProfilePage() {

    const navigate = useNavigate();

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
    const [friendId, setFriendId] = useState('');
    const [isFriend, setIsFriend] = useState(false);
    const [pageRerender, setPageRerender] = useState(0);
    // console.log(pageRerender)
    // console.log(isFriend)

    async function getProfile() {
        try {
            const response = await axios.get('http://localhost:3000/users/user/659c907cf4fc8a9533bad187');
            console.log(response.status, response.data)
            setProfile(response.data);
            setFriendId(response.data._id)
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getProfile();
    }, [pageRerender]);

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:3000/users/user/659c80cee0f47de5e6b2faff');
            // console.log(response.status, response.data)
            setUser(response.data);
            setUserId(response.data._id)

            // Check if friendId is already in the friends array to determine isFriend
            if (response.data.friends.includes(friendId)) {
                setIsFriend(true);
            }

        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getUser()
    }, [profile]);

    const handleFriendButtonClick = async (event, userId, friendId, isFriend) => {
        try {
            if (isFriend) {
                // Delete friend
                await axios.delete("http://localhost:3000/users/deleteFriend", { data: { userId, friendId } });
                setIsFriend(false)
            } else {
                // Add friend
                await axios.put('http://localhost:3000/users/addFriend', { userId, friendId });
            }
        } catch (error) {
            console.error(error);
        }
        setPageRerender(pageRerender + 1)
    };

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
                <Row id='friends-posts-container'>
                    <Col>
                        Friend's Placeholder
                    </Col>
                </Row>
            </Row>
        </>
    )
}