import '../src/assets/App.css';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StartPage from './views/StartPage';
import Login from './views/authentication/Login';
import SignUp from './views/authentication/SignUp';
import UserProfilePage from './views/profile/UserProfilePage';
import UpdateProfile from './views/profile/UpdateProfile';
import OtherProfilePage from './views/profile/OtherProfilePage';
import ReaderSearch from './components/SiteLayout/ReaderSearch';
import NewsFeed from './views/profile/Newsfeed';
import MyComment from './components/MyComment';
import PostCreateForm from './components/post/PostCreateForm';
import Posts from './components/post/Post';
import AllReaders from './views/AllReaders';
import PostView from './components/post/PostView';

function App() {

  const [userId, setUserId] = useState('')
  const [user, setUser] = useState({
    _id: '',
    username: "",
    profile_name: '',
    about_section: '',
    imageURL: '',
    friends: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in before navigating
    if (!user.username && !["/Login", "/SignUp"].includes(window.location.pathname)) {
      // Navigate to start page only if not already on the login or sign-up page
      navigate('/');
    }
  }, [user.username, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/Login" element={<Login setUser={setUser} />} />
        <Route path="/SignUp" element={<SignUp />} />
        {user.username && (
          <>
            <Route path="/UserProfilePage" element={<UserProfilePage
              user={user}
            />} />
            <Route path="/UpdateProfile" element={<UpdateProfile
              user={user}
              setUser={setUser}
            />} />
            <Route
              path="/users/user/:id"
              element={<OtherProfilePage
                user={user}
                setUser={setUser}
                userId={userId}
                setUserId={setUserId}
              />}
            />
            <Route path="/ReaderSearch" element={<ReaderSearch />} />
            <Route path="/Newsfeed" element={<NewsFeed user={user} />} />
            <Route path="/PostCreateForm" element={<PostCreateForm />} />
            <Route path="/AllReaders" element={<AllReaders user={user} />} />
          </>
        )}
      </Routes>
    </div>
  )
}

export default App
