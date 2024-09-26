import { Link, useNavigate } from 'react-router-dom';
import logo from '../../src/assets/logo.png';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Here you would typically handle the logout process
        // For example, clear user session, remove tokens, etc.
        // Then navigate to the home page
        navigate('/');
    };

    return (
        <header className="bg-cyan-950 text-white p-4 flex flex-col sm:flex-row justify-between items-center w-full z-50 static top-0 left-0">
            <div className="flex items-center mb-4 sm:mb-0">
                <img src={logo} alt="Company Logo" className="h-24 w-24 mr-2" />
                <Link to="/" className="text-5xl font-bold font-mono text-white">LCB Finance PLC</Link>
            </div>
            <nav className="flex justify-start w-full sm:w-auto ml-auto space-x-16 mr-24">
                
                <Link to="/pdfupload" className="text-white hover:text-purple-300 ">Upload Documents</Link>
                <Link to="/registration" className="text-white hover:text-purple-300">Add new User</Link>
                <Link to="#user_logs" className="text-white hover:text-purple-300">User Logs</Link>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
                >
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default Header;