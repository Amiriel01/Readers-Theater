import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router";
import Card from 'react-bootstrap/Card';

export default function ProfilePage() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: "",
        profile_name: '',
        about_section: '',
        imageURL: '',
        friends: [],
    });

    // const [friendData, setFriendData] = useState([]);

    // async function getUser() {
    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users/user/659c80cee0f47de5e6b2faff');
            console.log(response.status, response.data)
            setUser(response.data);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    // const renderFriends = async () => {
    //     console.log("coewbvoewb")
    //     if (!user || !user.friends) {
    //         return null;
    //     }

    //     // Clear the friendData state before making new requests
    //     setFriendData([]);

    //     await Promise.all(user.friends.map(async (friendId) => {
    //         try {
    //             // Fetch details for each friend using their ObjectId
    //             const response = await axios.get(`http://localhost:3000/users/user/${friendId}`)  // Replace with your actual API endpoint
    //             // console.log(response.data.profile_name);
    //             // console.log(response.data.imageURL);
    //             setFriendData(prevData => [...prevData, response.data]);
    //         } catch (error) {
    //             console.error('Error fetching friend data:', error);
    //         }
    //     }));
    // };

    // // Display profile_name and imageURL for each friend
    // console.log(friendData)

    // useEffect(() => {
    //     renderFriends();
    // }, [user]);


    const handleDeleteUser = () => {

        axios.delete('http://localhost:3000/users/user/6591f5e018252d4fa589528c');

        navigate('/StartPage')
    };

    return (
        <>
            <Row id='profile-page-container'>
                <Row id='profile-page-information-container'>
                    <Row >
                        <Col>
                            <h1 id='profile-page-hello'>
                                Hello, {user.username}! Welcome Back.
                            </h1>
                        </Col>
                    </Row>
                    <Row id='profile-information-container'>
                        <Col lg={4} id='profile-image-container'>
                            <img id='profile-image' src={`http://localhost:3000/public/${user.imageURL}`}></img>
                            <Link id='update-profile-link' to='/UpdateProfile'>Update Profile</Link>
                            <button id='delete-user-button' onClick={handleDeleteUser}>Delete User</button>
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
                                        {user.profile_name}
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
                                        {user.about_section}
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
                                {user.friends.map((friend, index) => {
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