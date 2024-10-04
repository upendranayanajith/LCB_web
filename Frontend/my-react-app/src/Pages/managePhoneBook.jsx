import React, { useState } from 'react';

const PhonebookEntryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    extensionCode: '',
    mobile: '',
    mobile2: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.name || !formData.designation || !formData.mobile) {
      setErrorMessage('Name, Designation, and Mobile are required fields.');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setSuccessMessage('Phonebook entry added successfully!');

    // Reset form after successful submission
    setFormData({
      name: '',
      designation: '',
      extensionCode: '',
      mobile: '',
      mobile2: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Phonebook Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="mobile2" className="block text-sm font-medium text-gray-700">Mobile 2</label>
            <input
              type="tel"
              id="mobile2"
              name="mobile2"
              value={formData.mobile2}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhonebookEntryForm;