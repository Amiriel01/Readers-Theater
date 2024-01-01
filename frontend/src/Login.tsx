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
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';

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
    const [showPassword, setShowPassword] = useState(false);

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
                navigate('/UserProfilePage')
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
            <div id='login-page-container'>
                <Row id='login-page-info-container'>
                    <Row>
                        <Col id='login-page-title'>
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
                                    type={showPassword ? "text" : "password"}
                                    name='password'
                                    placeholder='Password'
                                    value={login.password}
                                    onChange={handleChange}
                                />
                                <Button onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </FloatingLabel>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Alert hidden={!alertShow} variant={"danger"}>
                                    Username or Password Not Found
                                </Alert>
                            </Col>
                        </Row>
                        <div id='login-buttons-container'>
                            <Row>
                                <MyButton id='login-page-button1' title='Login'></MyButton>
                            </Row>
                            <Row>
                                <Link to='/StartPage'>
                                    <MyButton id='login-page-button2' title='Return to Homepage'></MyButton>
                                </Link>
                            </Row>
                        </div>
                    </Form>
                </Row>
            </div>
        </>
    )
}