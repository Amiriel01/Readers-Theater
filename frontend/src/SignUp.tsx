import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import MyButton from './MyButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import Alert from 'react-bootstrap/Alert';

interface SignUp {
    username: string,
    password: string,
    confirm_password: string,
    profile_name: string,
    about_section: string,
}

export default function SignUp() {

    const [signUp, setSignUp] = useState({
        username: '',
        password: '',
        confirm_password: "",
        profile_name: '',
        about_section: '',
    });

    const [alertShow, setAlertShow] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        setSignUp({
            ...signUp,
            [name]: value
        })
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (signUp.password === signUp.confirm_password) {
            const signUpData = {
                username: signUp.username,
                password: signUp.password,
                confirm_password: signUp.confirm_password,
                profile_name: signUp.profile_name,
                about_section: signUp.about_section,
            }
            setSignUp(signUpData)

            await axios.post("http://localhost:3000/users/userCreate", signUpData).then((response) => {
                console.log(response.status, response.data);
                if (response.status === 200) {
                    navigate('/StartPage')
                }
            })
        } else {
            setAlertShow(true)
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
                                    type="password"
                                    name='password'
                                    placeholder='Password'
                                    value={signUp.password}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel
                                label="Confirm Password">
                                <Form.Control
                                    required
                                    type="password"
                                    name='confirm_password'
                                    placeholder='Confirm Password'
                                    value={signUp.confirm_password}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Alert hidden={!alertShow} variant={"danger"}>
                                    Passwords Must Match
                                </Alert>
                            </Col>
                        </Row>
                        <div id='signup-buttons-container'>
                            <MyButton id='signup-page-button1' title='Sign Up'></MyButton>
                            <Link to='/StartPage'>
                                <MyButton id='signup-page-button2' title='Return to Homepage'></MyButton>
                            </Link>
                        </div>
                    </Form>
                </Row>
            </div>
        </>
    )
}