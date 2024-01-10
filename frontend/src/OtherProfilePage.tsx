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
    const [pageRerender, setPageRerender] = useState(0);
    const [friendData, setFriendData] = useState([]);
    // console.log(pageRerender)
    // console.log(isFriend)

    async function getProfile() {
        try {
            const response = await axios.get(`http://localhost:3000/users/user/${id}`);
            console.log(response.status, response.data)
            setProfile(response.data);
            setFriendId(response.data._id);

        } catch (err) {
            console.log(err)
        }
    };
    console.log('friendId', friendId)
    useEffect(() => {
        getProfile();
    }, [pageRerender]);

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:3000/users/user/659c80cee0f47de5e6b2faff');
            console.log(response.status, response.data)
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

    const renderFriends = async () => {
        if (!profile || !profile.friends) {
            return null;
        }

        // Clear the friendData state before making new requests
        setFriendData([]);

        await Promise.all(profile.friends.map(async (friendId) => {
            try {
                // Fetch details for each friend using their ObjectId
                const response = await axios.get(`http://localhost:3000/users/user/${friendId}`)  // Replace with your actual API endpoint

                // console.log(response.data.profile_name);
                // console.log(response.data.imageURL);
                setFriendData((prevData) => [...prevData, response.data]);
            } catch (error) {
                console.error('Error fetching friend data:', error);
            }
        }));
    };

    // Display profile_name and imageURL for each friend
    console.log(friendData)

    useEffect(() => {
        renderFriends();
    }, [user]);


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
                        <div id='following-container'>
                            <Row>
                                <Col id='following-title'>
                                    Following:
                                </Col>
                            </Row>
                            <div id='friend-card-container'>
                                {friendData.map((friend, index) => {
                                    return <Link to={"/users/user/" + friend._id} key={index} id='following-link'>
                                        <Card id='friend-card'>
                                            <img className='friend-image' src={`http://localhost:3000/public/${friend.imageURL}`}></img>
                                            <Card.Body>
                                                <Card.Title>{friend.profile_name}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                })}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Row>
        </>
    )
}