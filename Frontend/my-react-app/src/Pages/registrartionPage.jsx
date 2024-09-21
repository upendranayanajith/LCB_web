import { useState, useEffect } from 'react';
import Header from '../Components/headerAdmin';
import Footer from '../Components/footer';

const RegistrationPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    employeeName: '',
    department: '',
    jobRole: '',
    userName: '',
    password: '',
  });
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    description: '',
  });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('Error fetching users. Please try again.', 'error');
    }
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        showAlert('User added successfully!', 'success');
        setNewUser({
          employeeName: '',
          department: '',
          jobRole: '',
          userName: '',
          password: '',
        });
        fetchUsers();
      } else {
        showAlert('Failed to add user. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      showAlert('Error adding user. Please try again.', 'error');
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (response.ok) {
        showAlert('Category added successfully!', 'success');
        setNewCategory({ categoryName: '', description: '' });
      } else {
        showAlert('Failed to add category. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showAlert('Error adding category. Please try again.', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      <div className="container mx-auto p-6">
        {alert && (
          <div className={`mb-4 p-4 rounded ${alert.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {alert.message}
          </div>
        )}

        <section className="mb-8 border-2 border-[#7c53a5] rounded">
          <h2 className="text-2xl font-semibold text-[#7c53a5] mb-4">Add new User</h2>
          <form onSubmit={addUser} className="blue-100-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <input
                className="shadow appearance-none border border-blue-300  bg-blue-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="employeeName"
                type="text"
                placeholder="Employee Name *"
                value={newUser.employeeName}
                onChange={handleUserInputChange}
                required
              />
            </div>
            <div className="mb-4 flex">
              <select
                className="shadow appearance-none  bg-blue-100 border border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                name="department"
                value={newUser.department}
                onChange={handleUserInputChange}
                required
              >
                <option value="">Select Department *</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
              </select>
              <select
                className="shadow appearance-none border bg-blue-100 border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="jobRole"
                value={newUser.jobRole}
                onChange={handleUserInputChange}
                required
              >
                <option value="">Select Job Role *</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
              </select>
            </div>
            <div className="mb-4 flex">
              <input
                className="shadow appearance-none border border-blue-300 rounded bg-blue-100 w-full py-2 px-3 text--700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                name="userName"
                type="text"
                placeholder="User Name *"
                value={newUser.userName}
                onChange={handleUserInputChange}
                required
              />
              <input
                className="shadow appearance-none border bg-blue-100 border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="password"
                type="password"
                placeholder="Password *"
                value={newUser.password}
                onChange={handleUserInputChange}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#7c53a5] hover:bg-[#9a6ac8] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                ADD
              </button>
            </div>
          </form>
        </section>

        <section className="mb-8 border-2 border-[#7c53a5] rounded">
          <h2 className="text-2xl font-semibold text-[#7c53a5] mb-4">Add new Category</h2>
          <form onSubmit={addCategory} className="blue-100-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4 flex">
              <input
                className="shadow appearance-none border border-blue-300   bg-blue-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                name="categoryName"
                type="text"
                placeholder="Category Name"
                value={newCategory.categoryName}
                onChange={handleCategoryInputChange}
                required
              />
              <input
                className="shadow appearance-none border border-blue-300  bg-blue-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="description"
                type="text"
                placeholder="Description (optional)"
                value={newCategory.description}
                onChange={handleCategoryInputChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#7c53a5] hover:bg-[#9a6ac8] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                ADD
              </button>
            </div>
          </form>
        </section>

        <section className="border-2 border-[#7c53a5] rounded">
          <h2 className="text-2xl font-semibold text-[#7c53a5] mb-4">Existing Users</h2>
          <div className="blue-100-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="blue-100-200">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Dept</th>
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">Password</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'blue-100-300' : 'blue-100-200'}>
                    <td className="px-4 py-2">{user.employeeName}</td>
                    <td className="px-4 py-2">{user.jobRole}</td>
                    <td className="px-4 py-2">{user.department}</td>
                    <td className="px-4 py-2">{user.userName}</td>
                    <td className="px-4 py-2">*****</td>
                    <td className="px-4 py-2">
                      <button className="bg-[#7c53a5] hover:bg-[#9a6ac8] text-white font-bold py-1 px-2 rounded mr-2">
                        Edit
                      </button>
                      <button className="bg-red-300 hover:bg-red-400 text-black font-bold py-1 px-2 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default RegistrationPage;