import './App.css';
import { Route, Routes } from 'react-router-dom';
import StartPage from './StartPage';
import Login from './Login';
import SignUp from './SignUp';
import { useState } from 'react';
import UserProfilePage from './UserProfilePage';
import UpdateProfile from './UpdateProfile';
import OtherProfilePage from './OtherProfilePage';

export interface SiteLoggedIn {
  loggedIn: string,
  setLoggedIn: () => void,
}

export interface User {
  user: string,
  setUser: () => void,
}

function App() {

  // const [loggedIn, setLoggedIn] = useState<boolean>(false);
  // const [user, setUser] = useState<string>("");
  // console.log(user)

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
            // user={user}
          />}></Route>
          <Route path="/UpdateProfile" element={<UpdateProfile />}></Route>
          <Route path="/users/user/:id" element={<OtherProfilePage />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
