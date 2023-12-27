import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

export default function Login() {
    return (
        <>
            <FloatingLabel
                controlId="floatingInput"
                label="Username">
                <Form.Control
                    type="text"
                    placeholder='Username'
                />
            </FloatingLabel>
            <FloatingLabel
                controlId="floatingPassword"
                label="Password">
                <Form.Control
                    type="password"
                    placeholder='Password'
                />
            </FloatingLabel>
        </>
    )
}