import './App.css';
import { Route, Routes } from 'react-router-dom';
import StartPage from './StartPage';
import Login from './Login';
import SignUp from './SignUp';
import { useState } from 'react';
import ProfilePage from './ProfilePage';

export interface SiteLoggedIn {
  loggedIn: string,
  setLoggedIn: () => void,
}

function App() {

  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  return (
    <>
      <div>
        <Routes>
          <Route path="*" element={<StartPage />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/SignUp" element={<SignUp
            setLoggedIn={setLoggedIn}
          />}></Route>
          <Route path="/ProfilePage" element={<ProfilePage
            loggedIn={loggedIn}
          />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
