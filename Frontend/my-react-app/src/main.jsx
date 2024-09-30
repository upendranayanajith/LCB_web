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
import Tutorial from './Pages/tutorials.jsx';
import Circulars from './Pages/circulars.jsx';
import PdfUploadManager from './Pages/pdfUploadManager.jsx';
import HomeAdmin from './Pages/homeAdmin.jsx';
import HomeManager from './Pages/homeManager.jsx';
import Userlogs from './Pages/userLogs.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/pdfUpload" element={<PdfUpload />} />
        <Route path="/pdfView/:pdfPath" element={<PdfView />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/applications" element={<Application />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tutorials" element={<Tutorial />} />
        <Route path="/circulars" element={<Circulars />} />
        <Route path="/pdfuploadManager" element={<PdfUploadManager />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/homeManager" element={<HomeManager />} />
        <Route path="/userlogs" element={<Userlogs />} />
      </Routes>
    </Router>
  </React.StrictMode>
);