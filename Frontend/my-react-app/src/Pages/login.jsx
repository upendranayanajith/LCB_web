import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/header';
import Footer from '../Components/footer';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
        const response = await axios.post('http://localhost:5000/api/login', { username, password, role });
        const { token } = response.data;

        // Store the token in localStorage or a more secure storage method
        localStorage.setItem('token', token);

        // Redirect based on user role
        if (role === 'Admin' || role === 'Manager') {
            navigate('/pdfupload'); // Redirect to PDF upload for Admin/Manager
        } else if (role === 'User') {
            navigate('/'); // Redirect to home page for User
        } else {
            setErrorMessage('Unknown role. Please contact support.');
        }
    } catch (error) {
        // Handle the error without logging to console
        if (error.response) {
            // Only set error message for known status
            if (error.response.status === 401) {
                setErrorMessage('Invalid credentials');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } else {
            // Handle any other error (like network issues)
            setErrorMessage('Network error. Please check your connection.');
        }
    }
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-900 text-center">Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800"
                  required
                >
                  <option value="">Select user type</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </button>
              </div>
            </form>
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
