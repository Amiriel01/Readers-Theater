import axios from 'axios';
import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/SiteLayout/Header';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { UserInterface } from '../interfaces/user.interface';

//Define interface for AllReaders
interface AllReadersProps {
    user: UserInterface;
}

interface Reader {
    _id: string;
}

export default function AllReaders({ user }: AllReadersProps) {

    const [allReaders, setAllReaders] = useState([{
        _id: '',
        username: "",
        password: "",
        profile_name: '',
        about_section: '',
        imageURL: '',
        friends: [],
    }]);

    const getAllUsers = async () => {
        try {
            const response = await axios.get('users/userList');

             // Exclude the current user from allReaders
             const filteredReaders = response.data.filter((reader:  Reader) => reader._id !== user._id);

            setAllReaders(filteredReaders);

        } catch (error) {
            
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <>
            <Header />
            <Row id='all-readers-page-container'>
                <Row id='all-readers-container'>
                    <div id='suggested-readers-container'>
                        <Row>
                            <Col>
                                <h1 id='suggested-readers-title'>
                                    Suggested Readers
                                </h1>
                            </Col>
                        </Row>
                        <div id='suggested-readers-card-container'>
                            {allReaders.filter((reader) => !user.friends.some(friend => friend._id === reader._id)).map((readerDetails, index) => {
                                return <div key={index} id='readers-card-container'>
                                    <Card id='readers-card'>
                                        <img className='readers-image' src={`http://localhost:3000/public/${readerDetails.imageURL}`} alt={readerDetails.profile_name}></img>
                                        <Card.Body>
                                            <Card.Title>{readerDetails.profile_name}</Card.Title>
                                            <Link to={"/users/user/" + readerDetails._id} id='following-link'>
                                                <Card.Text>Visit Reader's Profile</Card.Text>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </div>
                            })}
                        </div>
                    </div>
                    <div id='suggested-readers-container'>
                        <Row>
                            <Col>
                                <h1 id='update-followed-title'>
                                    Readers You Follow
                                </h1>
                            </Col>
                        </Row>
                        <div id='suggested-readers-card-container'>
                            {allReaders.filter((reader) => user.friends.some(friend => friend._id === reader._id)).map((readerDetails, index) => {
                                return <div key={index} id='readers-card-container'>
                                    <Card id='readers-card'>
                                        <img className='readers-image' src={`http://localhost:3000/public/${readerDetails.imageURL}`} alt={readerDetails.profile_name}></img>
                                        <Card.Body>
                                            <Card.Title>{readerDetails.profile_name}</Card.Title>
                                            <Link to={"/users/user/" + readerDetails._id} id='following-link'>
                                                <Card.Text>Visit Reader's Profile</Card.Text>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </div>
                            })}
                        </div>
                    </div>
                </Row>
            </Row >
        </>
    )
}