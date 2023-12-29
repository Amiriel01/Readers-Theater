import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyButton from './MyButton';
import { Link } from 'react-router-dom';

export default function StartPage() {
    return (
        <>
            <div id='start-page-container'>
                <div id='start-page-info-section'>
                    <Row>
                        <Col id='start-page-title'>
                            Welcome to Reader's Theater
                        </Col>
                    </Row>
                    <Row>
                        <Col id='start-page-subtitle'>
                            A social media platform for readers to share their thoughts on books, authors, and more.
                        </Col>
                    </Row>
                    <Link to='/Login'>
                        <MyButton id='start-page-button1' title='Login'></MyButton>
                    </Link>
                    <Link to='/SignUp'>
                        <MyButton id='start-page-button2' title='Sign Up'></MyButton>
                    </Link>
                </div>
            </div>
        </>
    )
}