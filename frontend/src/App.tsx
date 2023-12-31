import './App.css';
import { Route, Routes } from 'react-router-dom';
import StartPage from './StartPage';
import Login from './Login';
import SignUp from './SignUp';
import { useState } from 'react';
import ProfilePage from './ProfilePage';
import CreateProfile from './CreateProfile';

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
          <Route path="/ProfilePage" element={<ProfilePage
            // loggedIn={loggedIn}
            // user={user}
          />}></Route>
          <Route path="/CreateProfile" element={<CreateProfile />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
