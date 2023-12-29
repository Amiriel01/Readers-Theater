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

interface Login {
    username: string,
    password: string,
}

export default function Login() {

    const [login, setLogin] = useState({
        username: '',
        password: '',
    });

    const [alertShow, setAlertShow] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        setLogin({
            ...login,
            [name]: value
        })
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const signUpData = {
            username: login.username,
            password: login.password,
        }
        setLogin(signUpData)
        console.log(signUpData)

        await axios.post("http://localhost:3000/users/login", signUpData).then((response) => {
            console.log(response.status, response.data);
            if (response.status === 200) {
                navigate('/StartPage')
            } else {
                setAlertShow(true)
            }
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
                        Sign In
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
                                value={login.username}
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
                                value={login.password}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Form.Group>
                    <Row>
                        <Col>
                            <Alert hidden={!alertShow} variant={"danger"}>
                                Username and Password Not Recognized
                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <MyButton id='login-page-button' title='Login'></MyButton>
                    </Row>
                    <Row>
                        <Link to='/StartPage'>
                            <MyButton id='login-button' title='Return to Homepage'></MyButton>
                        </Link>
                    </Row>
                </Form>
            </Row>
        </>
    )
}