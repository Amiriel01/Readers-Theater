import axios from 'axios';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyButton from "./MyButton";
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default function CreateProfile() {

    const [user, setUser] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState(null);

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:3000/users/user/6590559d82e961c23fe35d72');
            // console.log(response.status, response.data)
            setUser(response.data.username);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getUser()
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

    const initialValues = {
        profile_name: "",
        about_section: "",
        imageURL: "",
    }

    const [profileData, setProfileData] = useState(initialValues);

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        // console.log(event.target)
        setProfileData({
            ...profileData,
            [name]: value
        })
    }

    async function formSubmit(event: FormEvent) {
        event.preventDefault();

        const profileFormData = {
            profile_name: profileData.profile_name,
            about_section: profileData.about_section,
            imageURL: imageURL,
            user: user,
        }

        setProfileData(initialValues);

        try {
            const response = await axios.post("http://localhost:3000/profile/profile_create", profileFormData);
            console.log(response.status, response.data);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Row id="event-form-page-container">
            <Row>
                <Col>
                    Hello, {user}! Create your profile.
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
                    <MyButton id='create-profile-page-button' title='Select Image'></MyButton>
                </div>
            </Form>
            <Form onSubmit={formSubmit}>
                <Form.Group className="mb-3">
                    <FloatingLabel
                        label="Profile Name">
                        <Form.Control
                            required
                            type="text"
                            name='profile_name'
                            placeholder='Type Profile Name Here'
                            value={profileData.profile_name}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3">
                    <FloatingLabel
                        label="About Section">
                        <Form.Control
                            required
                            type="text"
                            name='about_section'
                            placeholder='Type Information About Yourself Here'
                            value={profileData.about_section}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                </Form.Group>
                <div>
                    <MyButton id='create-profile-page-button' title='Submit Profile'></MyButton>
                </div>
            </Form>
        </Row>
    )
}