import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Components/header';
import Footer from '../Components/footer';

const ResponsivePhonebookTable = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.10.30:5000/api/entries');
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchData();
  }, []);

  const filteredEntries = entries
    .filter((entry) =>
      Object.values(entry).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((entry) => (filterDepartment ? entry.department === filterDepartment : true))
    .filter((entry) => (filterBranch ? entry.branch === filterBranch : true))
    .filter((entry) => (filterDesignation ? entry.designation === filterDesignation : true));

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-3xl font-bold text-center text-white">📞 Company Phonebook</h1>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search phonebook..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
              </select>

              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Branches</option>
                <option value="Head Office">Head Office</option>
                <option value="Branch 1">Branch 1</option>
                <option value="Branch 2">Branch 2</option>
              </select>

              <select
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Designations</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Accountant">Accountant</option>
                <option value="HR Specialist">HR Specialist</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {['Name', 'Designation', 'Department', 'Branch', 'Extension', 'Mobile', 'Email'].map((header) => (
                      <th
                        key={header}
                        onClick={() => requestSort(header.toLowerCase())}
                        className="p-3 text-left font-bold cursor-pointer"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{header}</span>
                          {sortConfig.key === header.toLowerCase() && (
                            <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedEntries.map((entry, index) => (
                    <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                      <td className="p-3">{entry.name}</td>
                      <td className="p-3">{entry.designation}</td>
                      <td className="p-3">{entry.department}</td>
                      <td className="p-3">{entry.branch}</td>
                      <td className="p-3">{entry.extensionCode}</td>
                      <td className="p-3">{entry.mobile}</td>
                      <td className="p-3">{entry.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedEntries.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xl font-semibold mb-2 text-gray-800">😕 No results found</p>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResponsivePhonebookTable;