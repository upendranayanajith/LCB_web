import logo from '../../src/assets/logo.png';

const Header = () => {
    return (
        <header className="bg-cyan-950 text-white p-4 flex flex-col sm:flex-row justify-between items-center w-full z-50 static top-0 left-0">
            <div className="flex items-center mb-4 sm:mb-0">
                <img src={logo} alt="Company Logo" className="h-24 w-24 mr-2" />
                <span className="text-5xl font-bold font-mono">LCB Finance PLC</span>
            </div>
            <nav className="flex space-x-32 justify-start w-full sm:w-auto pr-32">
                <a href="#home" className="text-white hover:text-purple-600">Home</a>
                <a href="#about" className="text-white hover:text-purple-600">About</a>
                <a href="#contact" className="text-white hover:text-purple-600">Contact</a>
            </nav>
        </header>
    );
};

export default Header;