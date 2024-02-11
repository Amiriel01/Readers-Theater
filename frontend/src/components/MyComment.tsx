import axios from '../utility/axios';
import { useEffect, useState, FormEvent } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import MyButton from './MyButton';
import { UserInterface } from '../interfaces/user.interface.js';
import { PostInterface } from '../interfaces/post.interface.js';

// Define interface for Newsfeed page
interface NewsfeedProps {
    user: UserInterface;
    post: PostInterface;
}

export default function MyComment({ user, post }: NewsfeedProps) {

    const [formVisibility, setFormVisibility] = useState<Record<string, boolean>>({});
    const [commentId, setCommentId] = useState("");
    const [allComments, setAllComments] = useState([{
        user: {
            _id: '',
            username: '',
            profile_name: '',
            about_section: '',
            imageURL: '',
            friends: [],
        },
        post: {
            _id: '',
        },
        comment_text: "",
        _id: '',
    }]);

    const [newComment, setNewComment] = useState({
        user: {},
        post: {},
        comment_text: "",
    });

    const [editedComment, setEditedComment] = useState({
        user: {},
        post: {},
        comment_text: '',
    });

    const handleToggleCommentForm = (commentId: string) => {
        setFormVisibility((prevVisibility: Record<string, boolean>) => ({
            ...prevVisibility,
            [commentId]: !prevVisibility[commentId],
        }));
    };

    const getAllComments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/comments/commentList');
            setAllComments(response.data.reverse());
        } catch (error) {

        }
    };

    useEffect(() => {
        getAllComments();
    }, [newComment, editedComment, post]);

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        setNewComment({
            ...newComment,
            [name]: value
        });
    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const commentData = {
            // userId: user._id,
            post: post,
            comment_text: newComment.comment_text,
        }

        try {
            const response = await axios.post("http://localhost:3000/comments/commentCreate", commentData);
            if (response.status === 200) {
                setNewComment(response.data)
                setNewComment({
                    user: {},
                    post: {},
                    comment_text: "",
                });
            }
        } catch (error) {

        }
    };

    const handleCommentChange = (event: FormEvent) => {
        const { name, value } = event.target as any;

        setEditedComment((prevEditedComment) => ({
            ...prevEditedComment,
            [name]: value
        }));
    };

    async function handleCommentEdit(event: FormEvent, commentId: string) {
        event.preventDefault();

        const commentEditData = {
            userId: user._id,
            post: post,
            comment_text: editedComment.comment_text,
        }

        try {
            const response = await axios.put(`http://localhost:3000/comments/commentDetails/${commentId}`, commentEditData);
            if (response.status === 200) {
                setEditedComment(response.data);
                setEditedComment({
                    user: {},
                    post: {},
                    comment_text: '',
                });
                handleToggleCommentForm(commentId);
            }
        } catch (error) {

        }
    };

    const handleDeleteComment = async (event: FormEvent, commentId: string) => {

        try {
            const commentDeleteResponse = await axios.delete(`http://localhost:3000/comments/commentDetails/${commentId}`);
            setAllComments(commentDeleteResponse.data.reverse())
        } catch (error) {

        };
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <FloatingLabel
                        label="Write a comment here!">
                        <Form.Control
                            required
                            as="textarea"
                            rows={3}
                            style={{ height: 'unset' }}
                            name='comment_text'
                            placeholder='Type Post Content Here'
                            value={newComment.comment_text}
                            onChange={handleChange}
                            maxLength={250}
                        />
                    </FloatingLabel>
                </Form.Group>
                <div id='comment-button-container'>
                    <MyButton id='user-post-button' title='Post Your Comment'></MyButton>
                </div>
            </Form>
            {allComments
                .filter(commentUser => commentUser.post && commentUser.post._id === post._id)
                .map((userComment) => (
                    <div key={userComment._id}>
                        <Card id='posts-card'>
                            <Card.Body>
                                <div id='post-flex-container'>
                                    <img id='post-image-thumbnail' src={`http://localhost:3000/public/${userComment.user.imageURL}`}></img>
                                    <div>
                                        <Card.Title>
                                            {userComment.user.profile_name}
                                        </Card.Title>
                                        <Card.Text>
                                            {userComment.comment_text}
                                        </Card.Text>
                                    </div>
                                </div>
                            </Card.Body>
                            <div id='post-buttons-container'>
                                {userComment.user._id === user._id && (
                                    <>
                                        <MyButton
                                            id='edit-post-button'
                                            title='Edit'
                                            onClick={(event) => {
                                                setCommentId(userComment._id);
                                                setEditedComment({
                                                    user: userComment.user,
                                                    post: userComment.post,
                                                    comment_text: userComment.comment_text,
                                                });
                                                handleToggleCommentForm(userComment._id);
                                            }}
                                        ></MyButton>
                                        <MyButton id='delete-post-button' title='Delete'
                                            onClick={(event) => {
                                                setCommentId(userComment._id);
                                                handleDeleteComment(event, userComment._id);
                                            }}></MyButton>
                                    </>
                                )}
                            </div>
                        </Card>
                        {formVisibility[commentId] && (
                            <Form onSubmit={(event) => handleCommentEdit(event, userComment._id)}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel
                                        label="Comment Text">
                                        <Form.Control
                                            required
                                            as="textarea"
                                            rows={3}
                                            style={{ height: 'unset' }}
                                            name='comment_text'
                                            value={editedComment.comment_text}
                                            onChange={handleCommentChange}
                                            maxLength={250}
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                                <MyButton id='user-post-button' title='Update Your Comment'></MyButton>
                            </Form>
                        )}
                    </div>
                ))}
        </>
    )
}