import axios from 'axios';
import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ProfilePage() {

    const [user, setUser] = useState('');
    const [profile, setProfile] = useState({
        profile_name: '',
        about_section: '',
        imageURL: '',
    });

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:3000/users/user/6590559d82e961c23fe35d72');
            console.log(response.status, response.data)
            setUser(response.data.username);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getUser()
    }, []);

    async function getProfile() {
        try {
            const response = await axios.get('http://localhost:3000/profile/profile_details/6591ed9fbde4e220c90fbc84');
            console.log(response.status, response.data)
            setProfile(response.data);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getProfile()
    }, []);

    return (
        <>
            <Row id='profile-page-container'>
                <Row id='profile-page-information-container'>
                    <Row >
                        <Col>
                            <h1 id='profile-page-hello'>
                                Hello, {user}! Welcome Back.
                            </h1>
                        </Col>
                    </Row>
                    <Row id='profile-information-container'>
                        <Col lg={4} id='profile-image-container'>
                            <img id='profile-image' src={`http://localhost:3000/public/${profile.imageURL}`}></img>
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
            </Row>
        </>
    )
}