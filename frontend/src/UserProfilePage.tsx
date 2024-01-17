import axios from 'axios';
import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import MyButton from './MyButton';
import Header from './Header';
import Comment from './Comment';

export default function UserProfilePage({ user, userComment }) {

    const navigate = useNavigate();
    const [postId, setPostId] = useState("");
    const [formVisibility, setFormVisibility] = useState({});
    // const [userComment, setUserComment] = useState(null);
    const [commentVisibility, setCommentVisibility] = useState({});

    const handleToggleCommentForm = (postId) => {
        setCommentVisibility((prevVisibility) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
        }));
    };

    const [newPost, setNewPost] = useState({
        user: {},
        title: '',
        content: '',
    });

    const [editedPost, setEditedPost] = useState({
        user: {},
        title: '',
        content: '',
    });

    const [allPosts, setAllPosts] = useState([{
        user: {},
        title: '',
        content: '',
    }]);

    const handleTogglePostForm = (postId) => {
        setFormVisibility((prevVisibility) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
        }));
    };

    const getAllPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/posts/postsList');
            console.log(response.status, response.data)
            setAllPosts(response.data);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getAllPosts();
    }, [newPost, editedPost]);

    const handleDeleteUser = () => {

        axios.delete('http://localhost:3000/users/user/6591f5e018252d4fa589528c');

        navigate('/StartPage')
    };

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        setNewPost({
            ...newPost,
            [name]: value
        });
    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const postData = {
            user: user,
            title: newPost.title,
            content: newPost.content,
        }

        try {
            const response = await axios.post("http://localhost:3000/posts/postCreate", postData);
            console.log(response.status, response.data);
            if (response.status === 200) {
                // console.log(response.data);
                setNewPost(response.data)
                setNewPost({
                    user: {},
                    title: '',
                    content: '',
                })
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    const handlePostChange = (event: FormEvent) => {
        const { name, value } = event.target as any;

        setEditedPost((prevEditedPost) => ({
            ...prevEditedPost,
            [name]: value === '' ? userPost[name] : value,
        }));
    };

    async function handlePostEdit(event: FormEvent, postId) {
        event.preventDefault();

        const postEditData = {
            user: user,
            title: editedPost.title,
            content: editedPost.content,
        }

        try {
            const response = await axios.put(`http://localhost:3000/posts/postDetails/${postId}`, postEditData);
            console.log(response.status, response.data);
            if (response.status === 200) {
                console.log(response.data);
                setEditedPost(response.data);
                setEditedPost({
                    user: {},
                    title: '',
                    content: '',
                });
                handleTogglePostForm(postId);
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleDeletePost = async (event, postId) => {

        try {
            const postDeleteResponse = await axios.delete(`http://localhost:3000/posts/postDetails/${postId}`);
            setAllPosts(postDeleteResponse.data)
        } catch (error) {
            console.error(error);
        };
    };

    return (
        <>
            <Header />
            <Row id='profile-page-container'>
                <Row id='profile-page-information-container'>
                    <Row >
                        <Col>
                            <h1 id='profile-page-hello'>
                                Hello, {user.username}! Welcome Back.
                            </h1>
                        </Col>
                    </Row>
                    <Row id='profile-information-container'>
                        <Col lg={4} id='profile-image-container'>
                            <img id='profile-image' src={`http://localhost:3000/public/${user.imageURL}`}></img>
                            <Link id='update-profile-link' to='/UpdateProfile'>Update Profile</Link>
                            <button id='delete-user-button' onClick={handleDeleteUser}>Delete User</button>
                        </Col>
                        <Col lg={6}>
                            <div id='profile-name-container'>
                                <Row>
                                    <Col id='profile-name-label'>
                                        Public Profile Name:
                                    </Col>
                                </Row>
                                <Row>
                                    <Col id='profile-name-info'>
                                        {user.profile_name}
                                    </Col>
                                </Row>
                            </div>
                            <div id='profile-about-container'>
                                <Row>
                                    <Col id='profile-about-label'>
                                        About Me:
                                    </Col>
                                </Row>
                                <Row>
                                    <Col id='profile-about-info'>
                                        {user.about_section}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Row>
                <Row id='following-posts-container'>
                    <div id='following-container'>
                        <Row>
                            <Col id='following-title'>
                                Followed Readers
                            </Col>
                        </Row>
                        <div id='following-cards-container'>
                            {user.friends.map((friend) => {
                                return <Link to={"/users/user/" + friend._id} key={friend._id} id='following-link'>
                                    <Card id='following-card'>
                                        <img className='following-image' src={`http://localhost:3000/public/${friend.imageURL}`}></img>
                                        <Card.Body>
                                            <Card.Title>{friend.profile_name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            })}
                        </div>
                    </div>
                    <div id='posts-container'>
                        <div id='post-form'>
                            <Row>
                                <Col className='posts-title'>
                                    Write a New Post
                                </Col>
                            </Row>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" id='first-input'>
                                    <FloatingLabel
                                        label="Post Title">
                                        <Form.Control
                                            required
                                            maxLength={25}
                                            type="text"
                                            name='title'
                                            placeholder='Type Post Title Here'
                                            value={newPost.title}
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel
                                        label="Post Content">
                                        <Form.Control
                                            required
                                            as="textarea"
                                            rows={6}
                                            style={{ height: 'unset' }}
                                            name='content'
                                            placeholder='Type Post Content Here'
                                            value={newPost.content}
                                            onChange={handleChange}
                                            maxLength={500}
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                                <MyButton id='user-post-button' title='Post Your Thought!'></MyButton>
                            </Form>
                        </div>
                        <div id='finished-posts'>
                            <Row>
                                <Col className='posts-title'>
                                    Previous Posts
                                </Col>
                            </Row>
                            {allPosts.filter(postUser => postUser.user._id === user._id).map((userPost) => (
                                <div key={userPost._id}>
                                    <div id='post-comment-container'>
                                        <Card id='posts-card'>
                                            <Card.Body>
                                                <div id='post-flex-container'>
                                                    <img id='post-image-thumbnail' src={`http://localhost:3000/public/${userPost.user.imageURL}`}></img>
                                                    <div>
                                                        <Card.Title>{userPost.title}</Card.Title>
                                                        <Card.Text>
                                                            {userPost.content}
                                                        </Card.Text>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                            <div id='post-buttons-container'>
                                                <MyButton
                                                    id='edit-post-button'
                                                    title='Edit'
                                                    onClick={(event) => {
                                                        setPostId(userPost._id);
                                                        setEditedPost({
                                                            user: userPost.user,
                                                            title: userPost.title,
                                                            content: userPost.content,
                                                        });
                                                        handleTogglePostForm(userPost._id);
                                                    }}
                                                ></MyButton>
                                                <MyButton id='delete-post-button' title='Delete'
                                                    onClick={(event) => {
                                                        setPostId(userPost._id);
                                                        handleDeletePost(event, userPost._id);
                                                    }}></MyButton>
                                                <MyButton
                                                    id='comment-button'
                                                    title='Comments'
                                                    onClick={() => handleToggleCommentForm(userPost._id)}
                                                ></MyButton>

                                            </div>
                                        </Card>
                                        {formVisibility[userPost._id] && (
                                            <Form onSubmit={(event) => handlePostEdit(event, userPost._id)}>
                                                <Form.Group className="mb-3" id='first-input'>
                                                    <FloatingLabel
                                                        label="Post Title">
                                                        <Form.Control
                                                            required
                                                            maxLength={25}
                                                            type="text"
                                                            name='title'
                                                            value={editedPost.title}
                                                            onChange={handlePostChange}
                                                        />
                                                    </FloatingLabel>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <FloatingLabel
                                                        label="Post Content">
                                                        <Form.Control
                                                            required
                                                            as="textarea"
                                                            rows={6}
                                                            style={{ height: 'unset' }}
                                                            name='content'
                                                            value={editedPost.content}
                                                            onChange={handlePostChange}
                                                            maxLength={500}
                                                        />
                                                    </FloatingLabel>
                                                </Form.Group>
                                                <MyButton id='user-post-button' title='Update Your Thought!'></MyButton>
                                            </Form>
                                        )}
                                        {commentVisibility[userPost._id] && (
                                            <Comment user={user} post={userPost} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Row >
            </Row >
        </>
    )
}