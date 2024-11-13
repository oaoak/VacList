import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<HomePage />} />
          </Routes>
      </Router>
  )
}

export default App;
