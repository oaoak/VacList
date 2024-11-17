import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import PreHomePage from "./pages/PreHomePage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FavoritePage from "./pages/FavoritePage";
import LocationDetailPage from "./pages/LocationDetailPage";
import VisitPage from "./pages/VisitPage";
import './App.css';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<PreHomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<RegisterPage />} />
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/favorite" element={<ProtectedRoute><FavoritePage /></ProtectedRoute>} />
              <Route path="/myvisit" element={<ProtectedRoute><VisitPage /></ProtectedRoute>} />
              <Route path="/location/:id" element={<ProtectedRoute><LocationDetailPage /></ProtectedRoute>} />
          </Routes>
      </Router>
  )
}

export default App;
