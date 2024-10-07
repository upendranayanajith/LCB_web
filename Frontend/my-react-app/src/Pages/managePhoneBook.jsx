import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../Components/header';
import Footer from '../Components/footer';

const PhonebookEntryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    branch: 'Head Office',
    department: '',
    extensionCode: '',
    mobile: '',
    email: '',
  });

  const [entries, setEntries] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const branchOptions = [
    'Head Office', 'Galle', 'Matara', 'Kandy', 'Kurunegala', 'Jaffna',
    'Kalmunai', 'Kegalle', 'Kuliyapitiya', 'Negombo', 'Panadura', 'Ratnapura'
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://192.168.10.30:5000/api/entries');
      // Ensure each entry has an id
      const entriesWithIds = response.data.map(entry => ({
        ...entry,
        id: entry.id || entry._id // Assuming the server might use _id
      }));
      setEntries(entriesWithIds);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setErrorMessage('Failed to fetch entries. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = (data) => {
    if (!data.name || !data.designation || !data.department || !data.mobile || !data.email) {
      setErrorMessage('Please fill in all required fields.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!/^\d{10}$/.test(data.mobile)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm(formData)) {
      return;
    }

    try {
      const response = await axios.post('http://192.168.10.30:5000/api/entries', formData);
      setSuccessMessage('Phonebook entry added successfully!');
      setEntries([...entries, response.data]);
      setFormData({
        name: '',
        designation: '',
        branch: 'Head Office',
        department: '',
        extensionCode: '',
        mobile: '',
        email: '',
      });
    } catch (error) {
      console.error('Error adding entry:', error);
      setErrorMessage('Failed to add entry. Please try again.');
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id, updatedData) => {
    if (!validateForm(updatedData)) {
      return;
    }

    try {
      // Ensure id is not undefined
      if (id === undefined) {
        throw new Error('Entry ID is undefined');
      }

      await axios.put(`http://192.168.10.30:5000/api/entries/${id}`, updatedData);
      setEntries(entries.map(entry => entry.id === id ? updatedData : entry));
      setEditingId(null);
      setSuccessMessage('Entry updated successfully!');
    } catch (error) {
      console.error('Error updating entry:', error);
      setErrorMessage('Failed to update entry. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {

      if (id === undefined) {
        throw new Error('Entry ID is undefined');
      }

      await axios.delete(`http://192.168.10.30:5000/api/entries/${id}`);
      setEntries(entries.filter(entry => entry.id !== id));
      setSuccessMessage('Entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting entry:', error);
      setErrorMessage('Failed to delete entry. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };



  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredEntries = entries.filter((entry) =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortColumn) {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Add Phonebook Entry</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation *</label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch *</label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {branchOptions.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department *</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="extensionCode" className="block text-sm font-medium text-gray-700">Extension Code</label>
                    <input
                      type="text"
                      id="extensionCode"
                      name="extensionCode"
                      value={formData.extensionCode}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile *</label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      pattern="\d{10}"
                      title="Please enter a valid 10-digit mobile number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Entry
                  </button>
                </div>
              </form>
              {successMessage && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          {/* Phonebook Entries Table */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Phonebook Entries</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extension</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entries.map((entry) => (
                      <tr key={entry.id}>
                        {editingId === entry.id ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={entry.name}
                                onChange={(e) => setEntries(entries.map(item => item.id === entry.id ? { ...item, name: e.target.value } : item))}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={entry.designation}
                                onChange={(e) => setEntries(entries.map(item => item.id === entry.id ? { ...item, designation: e.target.value } : item))}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={entry.branch}
                                onChange={(e) => setEntries(entries.map(item => item.id === entry.id ? { ...item, branch: e.target.value } : item))}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                {branchOptions.map(branch => (
                                  <option key={branch} value={branch}>{branch}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={entry.department}
                                onChange={(e) => setEntries(entries.map(item => item.id === entry.id ? { ...item, department: e.target.value } : item))}


                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={entry.extensionCode}
                                onChange={(e) => setEntries(entries.map(item => item.id === entry.id ? { ...item, extensionCode: e.target.value } : item))}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="tel"
                                value={entry.mobile}
                                onChange={(e) => setEntries(entries.map(item => item.id === entry.id ? { ...item, mobile: e.target.value } : item))}
                                pattern="\d{10}"
                                title="Please enter a valid 10-digit mobile number"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="email"
                                value={entry.email}
                                onChange={(e) => setEntries(entries.map(item => item.id === entry.id ? { ...item, email: e.target.value } : item))}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleSave(entry.id, entry)}
                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.designation}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.branch}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.department}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.extensionCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.mobile}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(entry.id)}
                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PhonebookEntryForm;