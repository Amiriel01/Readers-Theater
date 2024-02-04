import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import MyButton from '../MyButton';

export default function PostCard({ user, userPost, likeCount, handleToggleCommentForm, handleLike, setPostId, setEditedPost, handleToggleForm, handleDeletePost, isLiked }) {

    return (
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
                                    <span className="material-symbols-outlined" id='like-button-on'>
                                        favorite
                                    </span>
                                    :
                                    <span className="material-symbols-outlined" id='like-button-off'>
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
    )
}