import axios from '../../utility/axios.js';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useParams, useLocation, Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import MyButton from "../../components/MyButton";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useNavigate } from "react-router";
import { UserInterface } from '../../interfaces/user.interface.js';

//Define interface for Updaterofile
interface UpdateProfileProps {
    user: UserInterface;
    setUser: React.Dispatch<React.SetStateAction<UserInterface>>;
}

export default function UpdateProfile({user, setUser}:UpdateProfileProps) {

    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname]);

    const [userUpdate, setUserUpdate] = useState({
        username: "",
        password: "",
        profile_name: '',
        about_section: '',
        imageURL: '',
    });

    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState(null);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    };

    async function submitImage(event: FormEvent) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("image", image as Blob)

        try {
            const result = await axios.post("http://localhost:3000/upload-image-profile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setImageURL(result.data)
        } catch (error) {
       
        }
    };

    useEffect(() => {
        const profileTestInitialValues = {
            profile_name: user?.profile_name ?? "",
            about_section: user?.about_section ?? "",
        }
        setUserUpdate(profileTestInitialValues as any);
    }, [user]);

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        setUserUpdate({
            ...userUpdate,
            [name]: value,
        })
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const profileDataUpdate = {
            username: user.username,
            // password: user.password,
            profile_name: userUpdate.profile_name,
            about_section: userUpdate.about_section,
            imageURL: imageURL || user.imageURL,
        }

        axios.put(`http://localhost:3000/users/user/${user._id}`, profileDataUpdate).then((response) => {
            if (response.status === 200) {
                setUser({
                    ...user,
                    profile_name: userUpdate.profile_name,
                    about_section: userUpdate.about_section,
                    imageURL: profileDataUpdate.imageURL,
                 });
                navigate('/UserProfilePage')
            }
        })
    };

    return (
        <>
            <div id="create-profile-page-container">
                <Row id='create-profile-page-info-container'>
                    <Row>
                        <Col id='create-profile-page-title'>
                            Hello, {user.username}! Update your profile.
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
                                    value={userUpdate.profile_name}
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
                                    value={userUpdate.about_section}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <div>
                            <MyButton id='update-profile-page-button2' title='Submit Profile'></MyButton>
                            <MyButton id='update-profile-page-button3' title='Return to Profile Page'></MyButton>
                        </div>
                    </Form>
                </Row>
            </div>
        </>
    )
}