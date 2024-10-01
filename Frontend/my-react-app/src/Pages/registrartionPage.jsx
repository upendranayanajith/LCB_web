import  { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Components/headerAdmin';
import Footer from '../Components/footer';

const RegistrationPage = () => {
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empUserName, setEmpUserName] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [userRoles] = useState(['Admin', 'Manager']);

  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const [userLogs, setUserLogs] = useState([]);
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post(`http://192.168.10.30:5000/api/users`, {
        name: empName,
        department: selectedCategory,
        role: empRole,
        username: empUserName,
        password: empPassword,
      });

      if (response.status === 201) {
        setSuccessMessage('Employee registered successfully!');
        setEmpName('');
        setEmpRole('');
        setEmpUserName('');
        setEmpPassword('');
        setSelectedCategory('');
      } else {
        setErrorMessage('Failed to register employee.');
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.response?.data || error.message}`);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryDescription) {
      setErrorMessage('Both fields are required');
      return;
    }

    try {
      const response = await axios.post(`http://192.168.10.30:5000/api/categories`, {
        name: categoryName,
        description: categoryDescription,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage('Category added successfully!');
        setCategoryName('');
        setCategoryDescription('');
      } else {
        setErrorMessage('Failed to add category. Please try again.');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrorMessage('Error adding category. Please try again.');
    }
  };

  const fetchUserLogs = async () => {
    try {
      const response = await axios.get(`http://192.168.10.30:5000/api/userLogs`);
      if (response.status === 200) {
        setUserLogs(response.data);
      }
    } catch (error) {
      console.error('Error fetching user logs', error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://192.168.10.30:5000/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8"> {/* Add flex-grow here */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-12 text-blue-900 text-center ">Admin Dashboard</h1>
            
            <div className="grid md:grid-cols-2 gap-24">
              {/* Employee Registration Form */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Employee Registration</h2>
                <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                    <input
                      type="text"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      placeholder="Enter employee name"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                      
                      required
                    >
                      <option value="">Select a department</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.categoryName}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={empRole}
                      onChange={(e) => setEmpRole(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     required
                    >
                      <option value="">Select a role</option>
                      {userRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      value={empUserName}
                      onChange={(e) => setEmpUserName(e.target.value)}
                      placeholder="Enter username"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={empPassword}
                      onChange={(e) => setEmpPassword(e.target.value)}
                      placeholder="Enter password"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Register Employee
                    </button>
                  </div>
                </form>
              </div>

              {/* Category Management Form */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Add Category</h2>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category Description</label>
                    <textarea
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      placeholder="Enter category description"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     rows="4"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 "
                    >
                      Add Category
                    </button>
                  </div>
                </form>

                {/* User Logs Section */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-blue-800">User Logs</h2>
                  <button 
                    onClick={fetchUserLogs} 
                    className="mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View User Logs
                  </button>
                  {userLogs.length > 0 ? (
                    <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                      {userLogs.map((log, index) => (
                        <li key={index} className="p-2 bg-gray-100 rounded-md text-sm">{log}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No logs available.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="mt-6 p-4 bg-green-100 text-green-700 rounded">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">
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

export default RegistrationPage;