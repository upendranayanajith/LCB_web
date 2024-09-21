import logo from '../../src/assets/logo.png';

const Header = () => {
    return (
        <header className="bg-cyan-950 text-white p-4 flex flex-col sm:flex-row justify-between items-center w-full z-50 static top-0 left-0">
            <div className="flex items-center mb-4 sm:mb-0">
                <img src={logo} alt="Company Logo" className="h-24 w-24 mr-2" />
                <span className="text-5xl font-bold font-mono">LCB Finance PLC</span>
            </div>
            <nav className="flex justify-start w-full sm:w-auto ml-auto space-x-4">
                <a href="/" className="text-white hover:text-purple-600">Home</a>
                <a href="/pdfupload" className="text-white hover:text-purple-600">Upload Documents</a>
                <a href="/registration" className="text-white hover:text-purple-600" >Add new User</a>
                <a href="#user_logs" className="text-white hover:text-purple-600">User Logs</a>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded">Logout</button>
            </nav>
        </header>
    );
};

export default Header;