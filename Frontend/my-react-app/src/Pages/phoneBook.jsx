import React, { useState, useEffect } from 'react';

const ResponsivePhonebookTable = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchData = async () => {
      const mockData = [
        { id: 1, name: 'John Doe', designation: 'Manager', department: 'Sales', extensionCode: '101', mobile: '1234567890', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', designation: 'Developer', department: 'IT', extensionCode: '102', mobile: '9876543210', email: 'jane@example.com' },
        { id: 3, name: 'Alice Johnson', designation: 'Designer', department: 'Marketing', extensionCode: '103', mobile: '5555555555', email: 'alice@example.com' },
        { id: 4, name: 'Bob Williams', designation: 'Accountant', department: 'Finance', extensionCode: '104', mobile: '7777777777', email: 'bob@example.com' },
        { id: 5, name: 'Carol Brown', designation: 'HR Specialist', department: 'Human Resources', extensionCode: '105', mobile: '8888888888', email: 'carol@example.com' },
      ];
      setEntries(mockData);
    };

    fetchData();
  }, []);

  const filteredEntries = entries.filter(entry =>
    Object.values(entry).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
    <div className="max-w-full mx-auto p-5 font-sans">
      <h1 className="text-2xl font-bold text-center mb-5">📞 Company Phonebook</h1>
      
      {/* Search Bar */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search phonebook..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 text-lg border border-gray-300 rounded"
        />
      </div>

      {/* Phonebook Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Name', 'Designation', 'Department', 'Extension', 'Mobile', 'Email'].map((header) => (
                <th
                  key={header}
                  onClick={() => requestSort(header.toLowerCase())}
                  className="bg-gray-200 p-3 text-left font-bold cursor-pointer"
                >
                  {header}
                  {sortConfig.key === header.toLowerCase() && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry.id} className="border-b">
                <td className="p-3">{entry.name}</td>
                <td className="p-3">{entry.designation}</td>
                <td className="p-3">{entry.department}</td>
                <td className="p-3">{entry.extensionCode}</td>
                <td className="p-3">{entry.mobile}</td>
                <td className="p-3">{entry.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedEntries.length === 0 && (
        <div className="text-center mt-5">
          <p className="text-xl mb-2">😕 No results found</p>
          <p>Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default ResponsivePhonebookTable;
