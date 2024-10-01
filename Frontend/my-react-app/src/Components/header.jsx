

import { Link, useNavigate } from 'react-router-dom';
import logo from '../../src/assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';


const Header = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <header className="bg-[#146387] text-white p-4 flex flex-col sm:flex-row justify-between items-center w-full z-50 static top-0 left-0">
            <div className="flex items-center mb-4 sm:mb-0">
                <img src={logo} alt="Company Logo" className="h-24 w-24 mr-2" />
                <span className="text-5xl font-bold font-moderno">LCB Finance PLC</span>
            </div>
            <nav className="flex space-x-32 justify-start w-full sm:w-auto pr-32">
                {/* <Link to="/home" className="text-white hover:text-purple-600">Home</Link> */}


                <Link to="/home" className="flex items-center text-white hover:text-purple-400">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
</Link>

                
            </nav>
        </header>
    );
};

export default Header;