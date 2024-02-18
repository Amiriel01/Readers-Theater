import axios from '../../utility/axios.js';
import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router";
import Card from 'react-bootstrap/Card';
import Header from '../../components/SiteLayout/Header';
import PostCreateForm from '../../components/post/PostCreateForm';
import Posts from '../../components/post/Post.js';
import { UserInterface } from '../../interfaces/user.interface';
import { PostInterface } from '../../interfaces/post.interface';
import { PostModel } from '../../models/post.model';
import { backendURL } from '../../utility/backendSettings.js';

//Define interface for Updaterofile
interface UserProfileProps {
    user: UserInterface;
}

export default function UserProfilePage({ user }: UserProfileProps) {
    const navigate = useNavigate();
    const [postId, setPostId] = useState("");
    const [formVisibility, setFormVisibility] = useState({});
    const [commentVisibility, setCommentVisibility] = useState({});

    const [newPost, setNewPost] = useState(new PostModel());

    const [editedPost, setEditedPost] = useState({
        user: {},
        title: '',
        content: '',
    });

    const [allPosts, setAllPosts] = useState<PostInterface[]>([]);

    const handleTogglePostForm = (postId: string) => {
        setFormVisibility((prevVisibility: Record<string, boolean>) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
        }));
    };

    const handleToggleCommentForm = (postId: string) => {
        setCommentVisibility((prevVisibility: Record<string, boolean>) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
        }));
    };

    const getAllPosts = async () => {
        try {
            const response = await axios.get('posts/postsList');

            // Reverse the order of the posts
            const reversedPosts = response.data.reverse();

            setAllPosts(reversedPosts);
        } catch (error) {
            
        }
    };

    useEffect(() => {
        getAllPosts();
    }, [newPost, editedPost]);

    const handleToggleForm = (postId: string) => {
        setFormVisibility((prevVisibility: Record<string, boolean>) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
        }));
    };

    const handleDeleteUser = () => {

        axios.delete(`users/user/${user._id}`);

        navigate('/')
    };

    const handlePostEdit = async (editedData: PostInterface) => {
        try {
            // Fetch the updated post details after editing
            const response = await axios.get(`posts/postDetails/${editedData._id}`);

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
            
        }
    };

    const handlePostDelete = async (deletedData: PostInterface) => {
        try {
            // Fetch the updated list of posts
            const deletedPostsResponse = await axios.get('posts/postsList');

            // Set the state with the updated list of posts
            setAllPosts(deletedPostsResponse.data);

        } catch (error) {
           
        }
    };

    const handlePostCreated = async (newPostData: PostInterface) => {
        try {
            // Fetch the details of the created post
            const response = await axios.get(`posts/postDetails/${newPostData._id}`);

            if (response.status === 200) {
                // Fetch the updated list of posts
                const updatedPostsResponse = await axios.get('posts/postsList');

                // Reverse the order of the posts
                const reversedPosts = updatedPostsResponse.data.reverse();

                // Set the state with the updated list of posts
                setAllPosts(reversedPosts);
            }
        } catch (error) {
            
        }
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
                            <img id='profile-image' src={`${backendURL}public/${user.imageURL}`}></img>
                            {/* <Link id='update-profile-link' to='/UpdateProfile'>Update Profile</Link> */}
                            {/* <button id='delete-user-button' onClick={handleDeleteUser}>Delete User</button> */}
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
                                        <img className='following-image' src={`${backendURL}public/${friend.imageURL}`}></img>
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
                            <PostCreateForm
                                onPostCreated={handlePostCreated} />
                        </div>
                        <div id='finished-posts'>
                            <Row>
                                <Col className='posts-title'>
                                    Previous Posts
                                </Col>
                            </Row>
                            {allPosts.filter(postUser => postUser.user._id === user._id).map((userPost) => (
                                <div key={userPost._id}>
                                    <Posts
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
                        </div>
                    </div>
                </Row >
            </Row >
        </>
    )
}