import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Components/headerAdmin';
import Footer from '../Components/footer';

const ViewEntriesPopup = ({ entries, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-7xl shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Phonebook Entries</h3>
          <div className="mt-2 px-7 py-3">
            <div className="max-h-96 overflow-y-auto">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.branch}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.extensionCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.mobile}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => onEdit(entry)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                          Edit
                        </button>
                        <button onClick={() => onDelete(entry.id)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="items-center px-4 py-3">
          <button
            id="ok-btn"
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PhonebookEntryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    branch: '',
    department: '',
    extensionCode: '',
    mobile: '',
    email: '',
  });

  const [entries, setEntries] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([
    'Head Office', 'Galle', 'Matara', 'Kandy', 'Kurunegala', 'Jaffna',
    'Kalmunai', 'Kegalle', 'Kuliyapitiya', 'Negombo', 'Panadura', 'Ratnapura'
  ]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    fetchEntries();
    fetchDepartments();

  }, []);


  useEffect(() => {
    console.log('Departments state:', departments);
  }, [departments]);


  useEffect(() => {
    console.log('Branches state:', branches);
  }, [branches]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://192.168.10.30:5000/api/entries');
      const filteredEntries = response.data.filter(entry => entry.status === true);
      const entriesWithIds = filteredEntries.map(entry => ({
        ...entry,
        id: entry.id || entry._id
      }));
      setEntries(entriesWithIds);

      // Extract unique designations from entries
      const uniqueDesignations = [...new Set(entriesWithIds.map(entry => entry.designation))];
      setDesignations(uniqueDesignations);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setErrorMessage('Failed to fetch entries. Please try again.');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://192.168.10.30:5000/api/categories');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setErrorMessage('Failed to fetch departments. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCustomInput = (e, field, setField) => {
    const value = e.target.value;
    if (!field.includes(value)) {
      setField([...field, value]);
    }
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: value
    }));
  };

  const validateForm = (data) => {
    if (!data.name || !data.designation || !data.branch || !data.department || !data.mobile || !data.email) {
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
      console.log('Submitting form data:', formData); // Log the form data being sent
  
      let response;
      
      // Check if we are editing an existing entry
      if (editingEntry) {
          response = await axios.put(`http://192.168.10.30:5000/api/entries/${editingEntry.id}`, formData);
          setSuccessMessage('Phonebook entry updated successfully!');
          setEditingEntry(null); // Clear editing state
      } else {
          response = await axios.post('http://192.168.10.30:5000/api/entries', formData);
          setSuccessMessage('Phonebook entry added successfully!');
      }
  
      // Clear form data after submission
      setFormData({
          name: '',
          designation: '',
          branch: '',
          department: '',
          extensionCode: '',
          mobile: '',
          email: '',
      });
  
      // Refresh the entries list
      fetchEntries(); 
  
  } catch (error) {
      console.error('Error saving entry:', error);
  
      // Improve error handling
      if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          setErrorMessage(`Error: ${error.response.data.message || 'Failed to save entry. Please try again.'}`);
      } else if (error.request) {
          // The request was made but no response was received
          console.error('Request data:', error.request);
          setErrorMessage('No response from server. Please check your network connection.');
      } else {
          // Something happened in setting up the request
          setErrorMessage('Failed to save entry. Please try again.');
      }
  }
  
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData(entry);
    setIsPopupOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.10.30:5000/api/entries/${id}`);
      setEntries(entries.filter(entry => entry.id !== id));
      setSuccessMessage('Entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting entry:', error);
      setErrorMessage('Failed to delete entry. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                {editingEntry ? 'Edit Phonebook Entry' : 'Add Phonebook Entry'}
              </h2>
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
                      onChange={(e) => handleCustomInput(e, designations, setDesignations)}
                      required
                      list="designationOptions"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <datalist id="designationOptions">
                      {designations.map((designation, index) => (
                        <option key={index} value={designation} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch *</label>
                    <input
                      type="text"
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={(e) => handleCustomInput(e, branches, setBranches)}
                      required
                      list="branchOptions"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <datalist id="branchOptions">
                      {branches.map((branch, index) => (
                        <option key={index} value={branch} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department *</label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >

                      {departments.map((department) => (
                        <option key={department._id} value={department.categoryName}>
                          {department.categoryName}
                        </option>
                      ))}
                    </select>
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"

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
                    {editingEntry ? 'Update Entry' : 'Add Entry'}
                  </button>
                </div>

              </form>
              <div className="mt-4">
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  View Entries
                </button>
              </div>

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

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">


              <div className="max-w-full overflow-x-auto">

              </div>
            </div>
            <ViewEntriesPopup
              entries={entries}
              isOpen={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PhonebookEntryForm;