import './App.css';
import { Route, Routes } from 'react-router-dom';
import StartPage from './StartPage';
import Login from './Login';
import SignUp from './SignUp';

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="*" element={<StartPage />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/SignUp" element={<SignUp />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
