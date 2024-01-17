import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StartPage from './StartPage';
import Login from './Login';
import SignUp from './SignUp';
import UserProfilePage from './UserProfilePage';
import UpdateProfile from './UpdateProfile';
import OtherProfilePage from './OtherProfilePage';
import ReaderSearch from './ReaderSearch';
import NewsFeed from './Newsfeed';
import Comment from './Comment';
import axios from 'axios';

export interface SiteLoggedIn {
  loggedIn: string,
  setLoggedIn: () => void,
}

// export interface User {
//   user: {
//     username: string,
//     password: string,
//     profile_name: string,
//     about_section: string,
//     imageURL: string,
//     friends: array[],
//   },
//   setUser: () => void,
// }

function App() {

  const [userId, setUserId] = useState('');

  const [user, setUser] = useState({
    username: "",
    password: "",
    profile_name: '',
    about_section: '',
    imageURL: '',
    friends: [],
  });

  const [allPosts, setAllPosts] = useState([{
    user: {},
    title: '',
    content: '',
}]);

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/user/659c97f4d0ffbe6e7575d9f2');
      console.log(response.status, response.data)
      setUser(response.data);
      setUserId(response.data._id)
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  console.log(user)
  return (
    <>
      <div>
        <Routes>
          <Route path="*" element={<StartPage />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/SignUp" element={<SignUp
          // setLoggedIn={setLoggedIn}
          // setUser={setUser}
          />}></Route>
          <Route path="/UserProfilePage" element={<UserProfilePage
            // loggedIn={loggedIn}
            user={user}
          />}></Route>
          <Route path="/UpdateProfile" element={<UpdateProfile />}></Route>
          <Route path="/users/user/:id" element={<OtherProfilePage
            user={user}
            setUser={setUser}
            userId={userId}
            setUserId={setUserId}
          />}></Route>
          <Route path="/ReaderSearch" element={<ReaderSearch />}></Route>
          <Route path="/Newsfeed" element={<NewsFeed
            user={user}
          />}></Route>
          <Route path="/Comment" element={<Comment
            user={user}
          />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
