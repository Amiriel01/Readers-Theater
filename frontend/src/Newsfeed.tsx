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
import MyComment from './MyComment';
import PostCreateForm from './PostCreateForm';
import GetAllPosts from './GetAllPosts';
import App from './App';

export default function NewsFeed({ user }) {

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

    const handlePostCreated = async (newPostData) => {
        try {
            // Fetch the details of the created post
            const response = await axios.get(`http://localhost:3000/posts/postDetails/${newPostData._id}`);

            if (response.status === 200) {
                // Fetch the updated list of posts
                const updatedPostsResponse = await axios.get('http://localhost:3000/posts/postsList');
                console.log(updatedPostsResponse.status, updatedPostsResponse.data);

                // Reverse the order of the posts
                const reversedPosts = updatedPostsResponse.data.reverse();

                // Set the state with the updated list of posts
                setAllPosts(reversedPosts);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePostEdit = async (editedData) => {
        try {
            // Fetch the updated post details after editing
            const response = await axios.get(`http://localhost:3000/posts/postDetails/${editedData._id}`);
            
            if (response.status === 200) {
                // Update the state with the edited post data
                setEditedPost(response.data);
                
                // Update the state with the updated list of posts
                setAllPosts((prevPosts) => {
                    return prevPosts.map((post) =>
                        post._id === editedData._id ? response.data : post
                    );
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePostDelete = async (deletedData) => {
        try {
                // Fetch the updated list of posts
                const deletedPostsResponse = await axios.get('http://localhost:3000/posts/postsList');
                
                // Set the state with the updated list of posts
                setAllPosts(deletedPostsResponse.data);
            
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
                    <PostCreateForm
                        user={user}
                        onPostCreated={handlePostCreated}
                    />
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
                            <GetAllPosts
                                user={user}
                                userPost={userPost}
                                formVisibility={formVisibility}
                                handleToggleForm={handleToggleForm}
                                commentVisibility={commentVisibility}
                                postId={postId}
                                setPostId={setPostId}
                                onPostEdit={handlePostEdit}
                                onPostDelete={handlePostDelete}
                                handleToggleCommentForm={handleToggleCommentForm}
                            />
                        </div>
                    ))}
                </Row>
            </Row >
        </>
    )
}