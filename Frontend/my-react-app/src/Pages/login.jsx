import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/footer';
import bgImage from '../assets/bg_img.jpg';
import logo from '../assets/logo.png';
import login_img from '../assets/login_page_img.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password, role: 'Admin' });
      const { token } = response.data;

      localStorage.setItem('token', token);
      navigate('/homeAdmin');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid credentials');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const navigateToHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#146387] relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <main className="flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex">
          {/* Left Column - Logo, Title, Description, and Image */}
          <div className="w-1/2 bg-[#146387] p-6 flex flex-col items-center justify-center text-white">
            <div className="flex items-center mb-4">
              <img src={logo} alt="LCB Finance PLC Logo" className="w-16 mr-4" />
              <h1 className="text-3xl font-bold font-moderno">LCB Finance PLC</h1>
            </div>
            <h1 className="text-6xl font-bold mb-4">INTRANET</h1>
            <p className="text-center mb-8">
              Welcome to LCB Finance PLC&apos;s Document Handling Intranet. This platform is designed to streamline your document management process with ease and security. Select your user type to access, organize, and manage confidential documents efficiently, ensuring seamless collaboration across departments.
            </p>
            <img src={login_img} style={{ width: '350px', height: 'auto' }} alt="Login" className="opacity-80" />
          </div>
  
          {/* Right Column - Login Selection or Form */}
          <div className="w-1/2 p-16 bg-gradient-to-br from-[#146387] to-[#A05C9B] flex flex-col items-center justify-center">
            {!showLoginForm ? (
              <>
                <h2 className="text-3xl font-bold mb-6 text-white">Select User Type</h2>
                <div className="space-y-4 w-full">
                  <button
                    onClick={navigateToHome}
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#0F4C81] hover:bg-[#0D3D66] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C81] transition duration-150 ease-in-out"
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => setShowLoginForm(true)}
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#A05C9B] hover:bg-[#8A4E84] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A05C9B] transition duration-150 ease-in-out"
                  >
                    Admin Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6 text-white">Admin Login</h2>
                <form onSubmit={handleAdminLogin} className="space-y-4 w-full">
                  <div>
                    <label className="block text-sm font-medium text-white">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="mt-1 block w-full px-3 py-2 border border-[#A05C9B] rounded-md shadow-sm focus:ring-[#A05C9B] focus:border-[#A05C9B] bg-white text-[#146387]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="mt-1 block w-full px-3 py-2 border border-[#A05C9B] rounded-md shadow-sm focus:ring-[#A05C9B] focus:border-[#A05C9B] bg-white text-[#146387]"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0F4C81] hover:bg-[#0D3D66] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C81] mt-4 transition duration-150 ease-in-out">
                      Login
                    </button>
                  </div>
                </form>
                {errorMessage && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    {errorMessage}
                  </div>
                )}
                <button
                  onClick={() => setShowLoginForm(false)}
                  className="mt-4 text-white hover:underline"
                >
                  Back to User Selection
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;