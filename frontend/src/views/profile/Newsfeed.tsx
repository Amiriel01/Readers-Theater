import axios from '../../utility/axios';
import { useEffect, useState, FormEvent } from 'react';
import Header from '../../components/SiteLayout/Header';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import PostCreateForm from '../../components/post/PostCreateForm';
import Posts from '../../components/post/Post';
import { UserInterface } from '../../interfaces/user.interface.js';
import { PostInterface } from '../../interfaces/post.interface.js';

// Define interface for Newsfeed page
interface NewsfeedProps {
    user: UserInterface;
    handleToggleForm?: ((postId?: string | undefined) => void) | undefined;
}

export default function NewsFeed({ user }: NewsfeedProps) {

    const [postId, setPostId] = useState("");
    const [formVisibility, setFormVisibility] = useState({});
    const [showAllPosts, setShowAllPosts] = useState(true);
    const [commentVisibility, setCommentVisibility] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [likedPostId, setLikedPostId] = useState(null);
    const [updatedLikeCount, setUpdatedLikeCount] = useState(0);

    const [allPosts, setAllPosts] = useState<PostInterface[]>([]);

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

            // Reverse the order of the posts
            const reversedPosts = response.data.reverse();

            setAllPosts(reversedPosts);
        } catch (error) {

        }
    };

    useEffect(() => {
        getAllPosts();
    }, [newPost, editedPost, updatedLikeCount]);

    const handleToggleForm = (postId: string) => {
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

    const handleTogglePosts = () => {
        setShowAllPosts((prevShowAllPosts) => !prevShowAllPosts);
    };

    const filteredPosts = showAllPosts
        //.some() is an array method, it tests whether at least one element in the array passes the test. It returns a boolean value.
        ? allPosts
        : allPosts.filter((userPost) => user.friends.some(friend => friend._id === userPost.user._id) || user._id === userPost.user._id);

    const handlePostCreated = async (newPostData: PostInterface) => {
        try {
            // Fetch the details of the created post
            const response = await axios.get(`http://localhost:3000/posts/postDetails/${newPostData._id}`);

            if (response.status === 200) {
                // Fetch the updated list of posts
                const updatedPostsResponse = await axios.get('http://localhost:3000/posts/postsList');

                // Reverse the order of the posts
                const reversedPosts = updatedPostsResponse.data.reverse();

                // Set the state with the updated list of posts
                setAllPosts(reversedPosts);
            }
        } catch (error) {
           
        }
    };

    const handlePostEdit = async (editedData: PostInterface) => {
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
           
        }
    };

    const handlePostDelete = async (deletedData: PostInterface) => {
        try {
            // Fetch the updated list of posts
            const deletedPostsResponse = await axios.get('http://localhost:3000/posts/postsList');

            // Set the state with the updated list of posts
            setAllPosts(deletedPostsResponse.data.reverse());

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
                </Row>
            </Row >
        </>
    )
}