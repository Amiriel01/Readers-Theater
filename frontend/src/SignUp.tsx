import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MyButton from './MyButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { FormEvent, useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from "react-router";
import Alert from 'react-bootstrap/Alert';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SignUp {
    username: string,
    password: string,
    confirm_password: string,
    profile_name: string,
    imageURL: string,
    about_section: string,
}

export default function SignUp() {

    const [signUp, setSignUp] = useState({
        username: "",
        password: "",
        confirm_password: "",
        profile_name: "",
        imageURL: "",
        about_section: "",
    });
    const [step, setStep] = useState(1);
    const [passwordAlertShow, setPasswordAlertShow] = useState(false);
    const [usernameAlertShow, setUsernameAlertShow] = useState(false);
    const navigate = useNavigate();
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState(null);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
        setPasswordAlertShow(false);
        setUsernameAlertShow(false);
    };

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        setSignUp({
            ...signUp,
            [name]: value
        })
    };

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            console.log(event.target.files[0]);
            setImage(event.target.files[0]);
        }
    };

    useEffect(() => {
        submitImage()
    }, [image]);

    const submitImage = () => {
        console.log(image);
        if (image !== null) {
            const formData = new FormData();
            formData.append("image", image as Blob)

            axios.post("http://localhost:3000/upload-image", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                console.log(response.status, response.data);
                setImageURL(response.data);
            }).catch((ex) => {
                console.log(ex)
            })
        } else {
            return
        }
    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (signUp.password === signUp.confirm_password) {
            const signUpData = {
                username: signUp.username,
                password: signUp.password,
                confirm_password: signUp.confirm_password,
                profile_name: signUp.profile_name,
                imageURL: imageURL,
                about_section: signUp.about_section,
            }
            setSignUp(signUpData)

            // axios.post("http://localhost:3000/users/userCreate", signUpData).then((response) => {
            //     console.log(response.status, response.data);
            //     if (response.status === 200) {
            //         setUser(response.data.username);
            //         setLoggedIn(true)
            //         navigate('/ProfilePage')
            //     }
            // }).catch((ex) => {
            //     console.log(ex);
            //     if (ex.response.status) {
            //         setUsernameAlertShow(true)
            //         console.log(usernameAlertShow)
            //     }
            // })

            try {
                const response = await axios.post("http://localhost:3000/users/userCreate", signUpData);
                console.log(response.status, response.data);
                if (response.status === 200) {
                    console.log(response.data)
                    // setUser(response.data.username);
                    // setLoggedIn(true)
                    navigate('/UserProfilePage')
                }
            } catch (ex) {
                console.log(signUpData)
                console.log(ex);
                console.log(imageURL)
                console.log(signUp.about_section)
                console.log(signUp.profile_name)
                if (ex.response.status === 500) {
                    setUsernameAlertShow(true)
                }
            }
        } else {
            setPasswordAlertShow(true)
        }
    }


    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname]);

    return (
        <>
            <div id='signup-page-container'>
                <Row id='signup-page-info-container'>
                    <Row>
                        <Col id='signup-page-title'>
                            Sign Up To Join Reader's Theater!
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit}>
                        <ProgressBar now={(step / 3) * 100} />
                        {step === 1 && (
                            <>
                                <Form.Group className="mb-3">
                                    <FloatingLabel
                                        label="Username">
                                        <Form.Control
                                            required
                                            type="text"
                                            name='username'
                                            placeholder='Username'
                                            value={signUp.username}
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel
                                        label="Password">
                                        <Form.Control
                                            required
                                            type={showPassword1 ? "text" : "password"}
                                            name='password'
                                            placeholder='Password'
                                            value={signUp.password}
                                            onChange={handleChange}
                                        />
                                        <Button onClick={() => setShowPassword1(!showPassword1)}>
                                            {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel
                                        label="Confirm Password">
                                        <Form.Control
                                            required
                                            type={showPassword2 ? "text" : "password"}
                                            name='confirm_password'
                                            placeholder='Confirm Password'
                                            value={signUp.confirm_password}
                                            onChange={handleChange} />
                                        <Button onClick={() => setShowPassword2(!showPassword2)}>
                                            {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </FloatingLabel>
                                </Form.Group>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <Form.Group className="mb-3" >
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={onInputChange}
                                    />
                                </Form.Group>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <Form.Group className="mb-3">
                                    <FloatingLabel
                                        label="Profile Name">
                                        <Form.Control
                                            required
                                            type="text"
                                            name='profile_name'
                                            placeholder='Type Profile Name Here'
                                            value={signUp.profile_name}
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
                                            value={signUp.about_section}
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                            </>
                        )}
                        <div className="d-flex justify-content-between">
                            {step > 1 && (
                                <Button variant="secondary" onClick={handlePrevious}>
                                    Previous
                                </Button>
                            )}
                            {step < 3 ? (
                                <Button variant="primary" onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            )}
                        </div>
                    </Form>
                    <Row>
                        <Col>
                            <Alert className='sign-up-alert' hidden={!usernameAlertShow} variant={"danger"}>
                                Username Taken
                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Alert className='sign-up-alert' hidden={!passwordAlertShow} variant={"danger"}>
                                Passwords Must Match
                            </Alert>
                        </Col>
                    </Row>
                </Row>
            </div >
        </>
    )
}