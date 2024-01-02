import axios from 'axios';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useParams, useLocation, Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import MyButton from "./MyButton";
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default function UpdateProfile() {

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname]);

    const [user, setUser] = useState('');
    const [profile, setProfile] = useState({
        profile_name: '',
        about_section: '',
        imageURL: '',
    });

    const [profileUpdate, setProfileUpdate] = useState({
        profile_name: '',
        about_section: '',
        imageURL: '',
    });

    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState(null);

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:3000/users/user/6590559d82e961c23fe35d72');
            console.log(response.status, response.data)
            setUser(response.data.username);
            // console.log(response.data._id)
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

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            console.log(event.target.files[0]);
            setImage(event.target.files[0]);
        }
    };

    async function submitImage(event: FormEvent) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("image", image as Blob)

        try {
            const result = await axios.post("http://localhost:3000/upload-image", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(result.data)
            setImageURL(result.data)
            console.log(formData)
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        const profileTestInitialValues = {
            profile_name: profile?.profile_name ?? "",
            about_section: profile?.about_section ?? "",
        }
        setProfileUpdate(profileTestInitialValues);
    }, [profile]);

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        setProfileUpdate({
            ...profileUpdate,
            [name]: value,
        })
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const profileDataUpdate = {
            profile_name: profileUpdate.profile_name,
            about_section: profileUpdate.about_section,
            imageURL: imageURL,
            // user: user._id,
        }

        axios.put('http://localhost:3000/profile/profile_details/6591ed9fbde4e220c90fbc84', profileDataUpdate).then((response) => {
            console.log(response.status, response.data)
        })
    };

    // const handleDeleteProfile = () => {

    //     axios.delete('http://localhost:3000/profile/profile_details/6591f6e9db0157717c61a870');
    // };


    return (
        <>
        <div id="create-profile-page-container">
            <Row id='create-profile-page-info-container'>
                <Row>
                    <Col id='create-profile-page-title'>
                        Hello, {user}! Update your profile.
                    </Col>
                </Row>
                <Form onSubmit={submitImage} id="event-form-">
                    <Form.Group className="mb-3" >
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={onInputChange}
                        />
                    </Form.Group>
                    <div>
                        <MyButton id='update-profile-page-button1' title='Select Image'></MyButton>
                    </div>
                </Form>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <FloatingLabel
                            label="Profile Name">
                            <Form.Control
                                required
                                type="text"
                                name='profile_name'
                                placeholder='Type Profile Name Here'
                                // defaultValue={profile.profile_name}
                                value={profileUpdate.profile_name}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <FloatingLabel
                            label="About Section">
                            <Form.Control
                                required
                                as="textarea" 
                                rows={6}
                                style={{ height: 'unset' }}
                                name='about_section'
                                placeholder='Type Information About Yourself Here'
                                value={profileUpdate.about_section}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Form.Group>
                    <div>
                        <MyButton id='update-profile-page-button2' title='Submit Profile'></MyButton>
                        <MyButton id='update-profile-page-button3' title='Return to Start Page'></MyButton>
                    </div>
                </Form>
               
            </Row>
        </div>
        </>
    )
}