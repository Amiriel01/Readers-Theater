import axios from 'axios';
import { useEffect, useState, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import MyButton from './MyButton';
import NewsFeed from './Newsfeed';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import MyComment from './MyComment';

export default function GetAllPosts({ user, userPost, formVisibility, handleToggleForm, commentVisibility, postId, setPostId, onPostEdit, onPostDelete, handleToggleCommentForm, friendId }) {

    const [updatedLikeCount, setUpdatedLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const [allPosts, setAllPosts] = useState([{
        user: {},
        title: '',
        content: '',
        like_count: '',
    }]);

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

    useEffect(() => {
        setIsLiked(userPost.like ? true : false);
    }, [userPost.like]);

    const handleLike = async (postId) => {
        // Make a request to the backend to like/unlike the post
        try {
            const response = await axios.post(`http://localhost:3000/posts/postDetails/${postId}/like`, {
                user: user._id,
            });
            console.log(response.data.like)
            // Update the state based on the response
            setIsLiked(response.data.like ? true : false);
            // setLikeCount(response.data.like_count);
        } catch (ex) {
            console.log(ex);
        }
    };

    const handlePostChange = (event: FormEvent, userPost) => {
        const { name, value } = event.target as any;

        setEditedPost((prevEditedPost) => ({
            ...prevEditedPost,
            [name]: value === '' ? userPost[name] : value,
        }));
    };

    const handlePostEdit = async (event: FormEvent, postId) => {
        event.preventDefault();

        const postEditData = {
            user: user,
            title: editedPost.title,
            content: editedPost.content,
        };

        try {
            const response = await axios.put(`http://localhost:3000/posts/postDetails/${postId}`, postEditData);
            console.log(response.status, response.data);

            if (response.status === 200) {
                // Pass the edited post data to the callback function
                onPostEdit(response.data);

                // Reset the editedPost state
                setEditedPost({
                    user: {},
                    title: '',
                    content: '',
                });

                // Close the edit form
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
            onPostDelete(postDeleteResponse.data)
        } catch (error) {
            console.error(error);
        };
    };


    return (
        <>
            {userPost.user && (
                <div id='post-comment-container'>
                    <Card id='posts-card'>
                        <Card.Body>
                            <div id='post-flex-container'>
                                <Link id='post-name-link' to={"/users/user/" + userPost.user._id}>
                                    <img id='post-image-thumbnail' src={`http://localhost:3000/public/${userPost.user.imageURL}`}></img>
                                </Link>
                                <div>
                                    <Card.Subtitle id='post-profile-name'>{userPost.user.profile_name}</Card.Subtitle>
                                    <Card.Title id='post-profile-title'>{userPost.title}</Card.Title>
                                    <Card.Text id='post-text'>
                                        {userPost.content}
                                    </Card.Text>
                                    <div id='likes-container'>
                                        <button onClick={() => handleLike(userPost._id)} id='like-button-all'>
                                            {isLiked ?
                                                <span className="material-symbols-outlined" id='like-button-off'>
                                                    favorite
                                                </span>
                                                :
                                                <span className="material-symbols-outlined" id='like-button-on'>
                                                    favorite
                                                </span>
                                            }
                                        </button>
                                        <Card.Text id='like-count'>{likeCount}</Card.Text>
                                    </div>
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
                       formVisibility && formVisibility[userPost._id] && (
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
                        <MyComment user={user} post={userPost} />
                    )}
                </div >
            )
            }
        </>
    )
}