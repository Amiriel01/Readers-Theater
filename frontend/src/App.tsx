import './App.css';
import { Route, Routes } from 'react-router-dom';
import StartPage from './StartPage';

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="*" element={<StartPage />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
