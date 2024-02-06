import axios from '../../utility/axios';
import { useEffect, useState, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import MyButton from '../MyButton';
import MyComment from '../MyComment';
import PostView from './PostView';
import { PostInterface } from '../../interfaces/post.interface.js';
import { UserInterface } from '../../interfaces/user.interface.js';

// Define interface for Post page
interface PostPageProps {
    user: UserInterface;
    userPost: {
        user: UserInterface;
        _id: string;
        title: string;
        content: string;
        isLiked: boolean;
        likes: number;
    };
    formVisibility?: { [postId: string]: boolean };
    handleToggleForm?: ((postId?: string | undefined) => void) | undefined;
    commentVisibility?: { [postId: string]: boolean };
    postId?: string;
    setPostId?: React.Dispatch<React.SetStateAction<string>> | undefined;
    onPostEdit?: (editedPost: PostInterface) => void;
    onPostDelete?: (deletedPost: PostInterface) => void;
    handleToggleCommentForm?: (postId: string) => void;
    friendId?: string;
    setEditedPost?: React.Dispatch<React.SetStateAction<{ user: UserInterface; title: string; content: string }>> | undefined;
}

export default function GetAllPosts({ user, userPost, formVisibility, handleToggleForm, commentVisibility, postId, setPostId, onPostEdit, onPostDelete, handleToggleCommentForm, friendId }: PostPageProps) {

    // const [updatedLikeCount, setUpdatedLikeCount] = useState(0);
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
        if (userPost) {
            setIsLiked(userPost.isLiked);
            // console.log(userPost);
            setLikeCount(userPost.likes);
        }
    }, [userPost]);

    const handleLike = async (postId: string) => {
        // Make a request to the backend to like/unlike the post
        try {
            const response = await axios.post(`http://localhost:3000/posts/postDetails/${postId}/like`, {
                userId: user._id
            });
            // console.log(response.data.like_count);
            setLikeCount(response.data.like_count);
            setIsLiked(!isLiked);
            // console.log(response.data);

            // Check if the user has liked the post and update the isLiked state
            // console.log(response.data)
            // console.log(response.data.likes)
            // setIsLiked(response.data.like_count > 0);
            // setIsLiked(response.data.like !== null);
        } catch (ex) {
            console.log(ex);
        }
    };

    const handlePostChange = (event: FormEvent) => {
        const { name, value } = event.target as any;

        setEditedPost((prevEditedPost) => ({
            ...prevEditedPost,
            [name]: value
        }));
    };

    const handlePostEdit = async (event: FormEvent, postId: string) => {
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
                if (onPostEdit) {
                    // Pass the edited post data to the callback function
                    onPostEdit(response.data);
                }

                // Reset the editedPost state
                setEditedPost({
                    user: {},
                    title: '',
                    content: '',
                });

                // Close the edit form if the function exists
                if (handleToggleForm) {
                    handleToggleForm(postId);
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleDeletePost = async (event: FormEvent, postId: string) => {

        try {
            const postDeleteResponse = await axios.delete(`http://localhost:3000/posts/postDetails/${postId}`);
            setAllPosts(postDeleteResponse.data)

            if (onPostDelete) {
                onPostDelete(postDeleteResponse.data)
            }
        } catch (error) {
            console.error(error);
        };
    };

    return (
        <>
            {userPost && userPost.user && (
                <div id='post-comment-container'>
                    <PostView
                        user={user}
                        userPost={userPost}
                        isLiked={isLiked}
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
                    {commentVisibility && commentVisibility[userPost._id] && (
                        <MyComment user={user} post={userPost} />
                    )}
                </div >
            )
            }
        </>
    )
}