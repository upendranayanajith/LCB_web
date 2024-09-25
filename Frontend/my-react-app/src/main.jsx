import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Home from './Pages/home.jsx';
import Policies from './Pages/policies.jsx';
import PdfUpload from './Pages/pdfUpload.jsx';
import PdfView from './Pages/pdfView.jsx';
import RegistrationPage from './Pages/registrartionPage.jsx';
import Application from './Pages/applications.jsx';
import Login from './Pages/login.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/pdfUpload" element={<PdfUpload />} />
        <Route path="/pdfView/:pdfPath" element={<PdfView />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/applications" element={<Application />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);