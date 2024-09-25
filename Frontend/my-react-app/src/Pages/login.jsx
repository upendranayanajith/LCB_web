import { useState } from 'react';
import axios from 'axios';
import Header from '../Components/headerAdmin'; // Assuming you have a header component
import Footer from '../Components/footer'; // Assuming you have a footer component

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('User'); // Default user type
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/users', {
                username,
                password,
                userType,
            });

            if (response.status === 200) {
                setSuccessMessage('Login successful!');
                // Redirect or perform further actions based on user type
            } else {
                setErrorMessage('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setErrorMessage(`Error: ${error.response?.data || error.message}`);
        }
    };

    return (
        <div className="login-container">
            <Header />
            <form onSubmit={handleLoginSubmit} className="login-form">
                <h2>Login</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="userType">User Type:</label>
                    <select 
                        id="userType" 
                        value={userType} 
                        onChange={(e) => setUserType(e.target.value)} 
                    >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="User">User</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">Submit</button>
            </form>
            <Footer />
        </div>
    );
};

export default LoginPage;