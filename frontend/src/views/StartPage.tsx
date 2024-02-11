import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyButton from '../components/MyButton';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from '../../public/icon.png';

export default function StartPage() {
    return (
        <>
            <Helmet>
                <title>Reader's Theater Homepage</title>
                <meta name="description" content="Welcome to Reader's Theater, a social media site for all readers to discuss and share their favorite books." />
                <meta name="keywords" content="reading, social media, books, authors, book discussion" />
                <meta property="og:title" content="Reader's Theater Homepage" />
                <meta property="og:description" content="Welcome to Reader's Theater, a social media site for all readers to discuss and share their favorite books." />
                <meta property="og:image" content={Icon} />
                <meta property="og:url" content="https://example.com/my-page" />
            </Helmet>
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
                    <div id='start-page-buttons-container'>
                        <Link to='/Login'>
                            <MyButton id='start-page-button1' title='Login'></MyButton>
                        </Link>
                        <Link to='/SignUp'>
                            <MyButton id='start-page-button2' title='Sign Up'></MyButton>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}