import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyButton from './MyButton';
import { Link } from 'react-router-dom';

export default function StartPage() {
    return (
        <>
            <Row>
                <Col>
                    Welcome to Reader's Theater
                </Col>
            </Row>
            <Row>
                <Col>
                    A social media platform for readers to share their thoughts on books, authors, and more.
                </Col>
            </Row>
            <Link to='/Login'>
                <MyButton className='start-page-button' title='Login'></MyButton>
            </Link>
            <Link to='/SignUp'>
                <MyButton className='start-page-button' title='Sign Up'></MyButton>
            </Link>
        </>
    )
}