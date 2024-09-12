import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Home from './Pages/home.jsx';
import Policies from './Pages/policies.jsx';
import Login from './Components/login.jsx';
import PdfUpload from './Pages/pdfUpload.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pdfUpload" element={<PdfUpload />} />
      
        
      </Routes>
    </Router>
  </React.StrictMode>
);