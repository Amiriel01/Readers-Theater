import axios from '../../utility/axios';
import { useState, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import MyButton from '../MyButton';
import { User } from '../../interfaces/user.interface.js';
import { Post } from '../../interfaces/post.interface.js';

interface PostCreateProps {
    user: User;
    onPostCreated?: (onPostCreated: Post) => void;
}

export default function PostCreateForm({ user, onPostCreated }: PostCreateProps) {

    const [newPost, setNewPost] = useState({
        user: {},
        title: '',
        content: '',
    });

    const handleChange = (event: FormEvent) => {
        const { name, value } = event.target as any;
        setNewPost({
            ...newPost,
            [name]: value
        })
    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const postData = {
            title: newPost.title,
            content: newPost.content,
        };

        try {
            const response = await axios.post("http://localhost:3000/posts/postCreate", postData);
            console.log(response.status, response.data);

            if (response.status === 200) {
                console.log(response.data);
                setNewPost(response.data)
                setNewPost({
                    user: {},
                    title: '',
                    content: '',
                })

                if (onPostCreated) {
                    // Pass the edited post data to the callback function
                    onPostCreated(response.data);
                }
                
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <>
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
                            rows={3}
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
        </>
    )
}