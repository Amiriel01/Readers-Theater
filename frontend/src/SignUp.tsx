import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import MyButton from './MyButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FormEvent, useState, useEffect } from 'react';

interface SignUp {
    username: string,
    password: string,
    profile_name: string,
    about_section: string,
}

export default function SignUp() {

    const [signUp, setSignUp] = useState({
        username: '',
        password: '',
        profile_name: '',
        about_section: '',
    });

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        setSignUp({
            ...signUp,
            [name]: value
        })
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const signUpData = {
            username: signUp.username,
            password: signUp.password,
            profile_name: signUp.profile_name,
            about_section: signUp.about_section,
        }
        setSignUp(signUpData)

        await axios.post("http://localhost:3000/users/userCreate", signUpData).then((response) => {
            console.log(response.status, response.data);
        })
    }

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname]);

    return (
        <>
            <Row>
                <Row>
                    <Col>
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
                            label="Profile Name">
                            <Form.Control
                                required
                                type="text"
                                name='profile_name'
                                placeholder='Profile Name'
                                value={signUp.profile_name}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <FloatingLabel
                            label="About Me">
                            <Form.Control
                                as="textarea"
                                style={{ height: '100px' }}
                                name='about_section'
                                placeholder='About Me'
                                value={signUp.about_section}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Form.Group>
                    <Row>
                        <MyButton id='sign-up-submit-button' title='Submit'></MyButton>
                    </Row>
                </Form>
            </Row>
        </>
    )
}