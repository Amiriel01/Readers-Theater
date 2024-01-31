import ReaderSearch from "./ReaderSearch";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <>
            <Row id="header-page-container">
                <Row id="header-container">
                    <Col id="reader-search-input">
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
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Row >
        </>
    )
}