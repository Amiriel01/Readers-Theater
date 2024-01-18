import axios from 'axios';
import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import MyButton from './MyButton';
import Card from 'react-bootstrap/Card';
import Comment from './Comment';
import PostCreateForm from './PostCreateForm';
import App from './App';

export default function NewsFeed({ user }) {
    console.log(user)

    const [postId, setPostId] = useState("");
    const [formVisibility, setFormVisibility] = useState({});
    const [showAllPosts, setShowAllPosts] = useState(true);
    const [commentVisibility, setCommentVisibility] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [likedPostId, setLikedPostId] = useState(null);
    const [updatedLikeCount, setUpdatedLikeCount] = useState(0);

    const [allPosts, setAllPosts] = useState([{
        user: {},
        title: '',
        content: '',
        // like_count: '',
    }]);

    const [editedPost, setEditedPost] = useState({
        user: {},
        title: '',
        content: '',
    });

    const [newPost, setNewPost] = useState({
        user: {},
        title: '',
        content: '',
    });

    // const handlePostCreated = (newPostData) => {
    //     setAllPosts((prevPosts) => [newPostData, ...prevPosts]);
    // };


    const handleToggleForm = (postId) => {
        setFormVisibility((prevVisibility) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
        }));
    };

    const handleToggleCommentForm = (postId) => {
        setCommentVisibility((prevVisibility) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
        }));
    };

    const handleTogglePosts = () => {
        setShowAllPosts((prevShowAllPosts) => !prevShowAllPosts);
    };

    const filteredPosts = showAllPosts
        //.some() is an array method, it tests whether at least one element in the array passes the test. It returns a boolean value.
        ? allPosts
        : allPosts.filter((userPost) => user.friends.some(friend => friend._id === userPost.user._id) || user._id === userPost.user._id);

    const getAllPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/posts/postsList');
            console.log(response.status, response.data)

            // Reverse the order of the posts
            const reversedPosts = response.data.reverse();

            setAllPosts(reversedPosts);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getAllPosts();
    }, [newPost, editedPost, updatedLikeCount]);

    const handlePostChange = (event: FormEvent, userPost) => {
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
                handleToggleForm(postId);
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

    // const handlePostCreated = (newPostData) => {
    //     setAllPosts((prevPosts) => [...prevPosts, newPostData]);
    // };

    const handlePostCreated = async (newPostData) => {
        try {
            // Fetch the details of the created post
            const response = await axios.get(`http://localhost:3000/posts/postDetails/${newPostData._id}`);

            if (response.status === 200) {
                // Add the fetched post to the allPosts array
                setAllPosts((prevPosts) => [...prevPosts, response.data]);
            }
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <>
            <Header />
            <Row id='newsfeed-page-container'>
                <Row id='newsfeed-form-contaner'>
                    <Row>
                        <Col>
                            <h1 id='newsfeed-page-title'>
                                Make A Post
                            </h1>
                        </Col>
                    </Row>
                    <PostCreateForm user={user} onPostCreated={handlePostCreated} />
                </Row>
                <Row id='all-posts-container'>
                    <Row>
                        <Col>
                            <h1 id='newsfeed-page-title'>
                                Reader Posts
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col id='posts-toggle'>
                            <Form.Check
                                type="switch"
                                id="toggle-posts-switch"
                                label="Show Followed Readers Only"
                                onChange={handleTogglePosts}
                            />
                        </Col>
                    </Row>
                    {filteredPosts.map((userPost) => (
                        <div key={userPost._id}>
                            <div id='post-comment-container'>
                                <Card id='posts-card'>
                                    <Card.Body>
                                        <div id='post-flex-container'>
                                            <Link id='post-name-link' to={"/users/user/" + userPost.user._id}>
                                                <img id='post-image-thumbnail' src={`http://localhost:3000/public/${userPost.user.imageURL}`}></img>
                                            </Link>
                                            <div>
                                                <Card.Subtitle id='post-profile-name'>{userPost.user.profile_name}</Card.Subtitle>
                                                <div id='title-likes'>
                                                    <Card.Title id='post-title'>{userPost.title}</Card.Title>
                                                    <div>
                                                        <button onClick={() => handleLike(userPost._id)}>
                                                            {userPost.like ? 'Unlike' : 'Like'}
                                                        </button>
                                                    </div>
                                                    <Card.Text id='like-count'>{userPost.like_count}</Card.Text>
                                                </div>
                                                <Card.Text>
                                                    {userPost.content}
                                                </Card.Text>
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <div id='post-buttons-container'>
                                        {userPost.user._id !== user._id && (
                                            <>
                                                <MyButton
                                                    id='comment-button'
                                                    title='Comments'
                                                    onClick={() => handleToggleCommentForm(userPost._id)}
                                                ></MyButton>
                                            </>
                                        )}
                                    </div>
                                    <div id='post-buttons-container'>
                                        {userPost.user._id === user._id && (
                                            <>
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
                                                        handleToggleForm(userPost._id);
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
                                            </>
                                        )}
                                    </div>
                                </Card>
                                {
                                    formVisibility[userPost._id] && (
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
                                            <MyButton id='newsfeed-edit-post-button' title='Update Your Thought!'></MyButton>
                                        </Form>
                                    )}
                                {commentVisibility[userPost._id] && (
                                    <Comment user={user} post={userPost} />
                                )}
                            </div>
                            {/* )} */}
                        </div>
                    ))}
                </Row>
            </Row >
        </>
    )
}