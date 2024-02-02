import axios from '../../utility/axios';
import { useEffect, useState, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import MyButton from '../MyButton';
import NewsFeed from '../../views/profile/Newsfeed';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import MyComment from '../MyComment';
import PostCard from './PostView';

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
                userId: user._id
            });
            // console.log(response.data.like_count);
            setLikeCount(response.data.like_count);

            // Check if the user has liked the post and update the isLiked state
            console.log(response.data)
            console.log(response.data.likes)
            // setIsLiked(response.data.like_count > 0);
            // setIsLiked(response.data.like !== null);
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
            // userId: user._id,
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
                    <PostCard
                        user={user}
                        userPost={userPost}
                        // isLiked={isLiked}
                        likeCount={likeCount}
                        handleToggleCommentForm={handleToggleCommentForm}
                        handleLike={handleLike}
                        setPostId={setPostId}
                        setEditedPost={setEditedPost}
                        handleToggleForm={handleToggleForm}
                        handleDeletePost={handleDeletePost}
                    />
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