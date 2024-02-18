import axios from '../../utility/axios';
import { useEffect, useState, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import MyButton from '../MyButton';
import MyComment from '../MyComment';
import PostView from './PostView';
import { PostInterface } from '../../interfaces/post.interface';
import { UserInterface } from '../../interfaces/user.interface';

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
    handleToggleForm?: ((postId?: string | undefined) => void);
    commentVisibility?: { [postId: string]: boolean };
    postId?: string;
    setPostId?: React.Dispatch<React.SetStateAction<string>>;
    onPostEdit?: (editedPost: PostInterface) => void;
    onPostDelete?: (deletedPost: PostInterface) => void;
    handleToggleCommentForm: (postId: string) => void;
    friendId?: string;
    setEditedPost?: React.Dispatch<React.SetStateAction<{ 
        user: UserInterface; 
        title: string; 
        content: string 
    }>>;
}

export default function Post({ user, userPost, formVisibility, handleToggleForm, commentVisibility, postId, setPostId, onPostEdit, onPostDelete, handleToggleCommentForm, friendId }: PostPageProps) {

    // const [updatedLikeCount, setUpdatedLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const [allPosts, setAllPosts] = useState([{
        user: {
            _id: '',
            username: '',
            profile_name: '',
            about_section: '',
            imageURL: '',
            friends: [],
        },
        title: '',
        content: '',
        like_count: '',
    }]);

    const [newPost, setNewPost] = useState({
        user: {
            _id: '',
            username: '',
            profile_name: '',
            about_section: '',
            imageURL: '',
            friends: [],
        },
        title: '',
        content: '',
    });

    const [editedPost, setEditedPost] = useState({
        user: {
            _id: '',
            username: '',
            profile_name: '',
            about_section: '',
            imageURL: '',
            friends: [],
        },
        title: '',
        content: '',
    });

    useEffect(() => {
        if (userPost) {
            setIsLiked(userPost.isLiked);
            setLikeCount(userPost.likes);
        }
    }, [userPost]);

    const handleLike = async (postId: string) => {
        // Make a request to the backend to like/unlike the post
        try {
            const response = await axios.post(`posts/postDetails/${postId}/like`, {
                userId: user._id
            });
            setLikeCount(response.data.like_count);
            setIsLiked(!isLiked);
        } catch (error) {
            
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
            title: editedPost.title,
            content: editedPost.content,
        };

        try {
            const response = await axios.put(`posts/postDetails/${postId}`, postEditData);

            if (response.status === 200) {
                if (onPostEdit) {
                    // Pass the edited post data to the callback function
                    onPostEdit(response.data);
                }

                // Reset the editedPost state
                setEditedPost({
                    user: {
                        _id: '',
                        username: '',
                        profile_name: '',
                        about_section: '',
                        imageURL: '',
                        friends: [],
                    },
                    title: '',
                    content: '',
                });

                // Close the edit form if the function exists
                if (handleToggleForm) {
                    handleToggleForm(postId);
                }
            }
        } catch (error) {

        }
    };

    const handleDeletePost = async (event: FormEvent, postId: string) => {

        try {
            const postDeleteResponse = await axios.delete(`posts/postDetails/${postId}`);
            setAllPosts(postDeleteResponse.data)

            if (onPostDelete) {
                onPostDelete(postDeleteResponse.data)
            }
        } catch (error) {

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
                        <MyComment 
                        user={user} 
                        post={userPost} 
                        />
                    )}
                </div >
            )
            }
        </>
    )
}