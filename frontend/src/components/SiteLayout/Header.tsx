import ReaderSearch from "./ReaderSearch";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from '../../utility/axios';

export default function Header() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.get('users/logout');

            if (response.status === 200) {
                // Redirect to the start page
                navigate('/');
            } else {
                // Handle logout error

            }
        } catch (error) {

        }
    };

    return (
        <>
            <Row id="header-page-container">
                <Row id="header-container">
                    <Col id="reader-search-input" className="search-bar">
                        <ReaderSearch />
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className="e-caret-hide">
                                <span className="material-symbols-outlined">menu</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/UserProfilePage">
                                    My Profile
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/Newsfeed">
                                    Newsfeed
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/AllReaders">
                                    All Readers
                                </Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>
                                    Log Out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Row >
        </>
    )
}