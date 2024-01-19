import axios from 'axios';
import { useEffect, useState, FormEvent } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import MyButton from './MyButton';

export default function MyComment({ user, post, openCommentForms, toggleCommentForm }) {

    const [formVisibility, setFormVisibility] = useState({});
    const [commentId, setCommentId] = useState("");
    const [allComments, setAllComments] = useState([{
        user: {},
        post: {},
        comment_text: "",
    }]);

    const [newComment, setNewComment] = useState({
        user: {},
        post: {},
        comment_text: "",
    });

    const [editedComment, setEditedComment] = useState({
        user: {},
        title: '',
        content: '',
    });

    const handleToggleCommentForm = (commentId) => {
        setFormVisibility((prevVisibility) => ({
            ...prevVisibility,
            [commentId]: !prevVisibility[commentId],
        }));
    };

    const getAllComments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/comments/commentList');
            console.log(response.status, response.data)
            setAllComments(response.data);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getAllComments();
    }, [newComment, editedComment]);

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
            user: user,
            post: post,
            comment_text: newComment.comment_text,
        }

        try {
            const response = await axios.post("http://localhost:3000/comments/commentCreate", commentData);
            console.log(response.status, response.data);
            if (response.status === 200) {
                // console.log(response.data);
                setNewComment(response.data)
                setNewComment({
                    user: {},
                    post: {},
                    comment_text: "",
                });
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleCommentChange = (event: FormEvent) => {
        const { name, value } = event.target as any;

        setEditedComment((prevEditedComment) => ({
            ...prevEditedComment,
            [name]: value === '' ? userComment[name] : value,
        }));
    };

    async function handleCommentEdit(event: FormEvent, commentId) {
        event.preventDefault();

        const commentEditData = {
            user: user,
            post: post,
            comment_text: editedComment.comment_text,
        }

        try {
            const response = await axios.put(`http://localhost:3000/comments/commentDetails/${commentId}`, commentEditData);
            console.log(response.status, response.data);
            if (response.status === 200) {
                console.log(response.data);
                setEditedComment(response.data);
                setEditedComment({
                    user: {},
                    post: {},
                    comment_text: '',
                });
                handleToggleCommentForm(commentId);
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleDeleteComment = async (event, commentId) => {

        try {
            const commentDeleteResponse = await axios.delete(`http://localhost:3000/comments/commentDetails/${commentId}`);
            setAllComments(commentDeleteResponse.data)
        } catch (error) {
            console.error(error);
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
            {allComments.filter(commentUser => commentUser.user._id === user._id && commentUser.post._id === post._id).map((userComment) => (
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