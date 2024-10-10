import Header from '../Components/headerAdmin';
import Footer from '../Components/footer';


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDocumentReview = () => {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch documents where approval is false
  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://192.168.10.30:5000/api/pdfs');
      const unapprovedDocs = response.data.filter(doc => doc.approval === false);
      setDocuments(unapprovedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setMessage({ type: 'error', content: 'Failed to fetch documents' });
    }
  };
  

  // Handle approve or reject actions
  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        // Update approval status to true
        const response = await axios.put(`http://192.168.10.30:5000/api/pdfs/${id}`, { approval: true });
        if (response.status === 200) {
          setMessage({ type: 'success', content: 'Document approved successfully' });
        }
      } else if (action === 'reject') {
        // Delete the document
        const response = await axios.delete(`http://192.168.10.30:5000/api/pdfs/${id}`);
        if (response.status === 200) {
          setMessage({ type: 'success', content: 'Document rejected and deleted successfully' });
        }
      }
      fetchDocuments(); // Refresh the document list after action
    } catch (error) {
      console.error(`Error performing ${action} on document:`, error);
      setMessage({ type: 'error', content: `Failed to ${action} document` });
    }
  };

  // View PDF in a new tab
  const viewPdf = async (pdfLink) => {
    const baseUrl = 'http://192.168.10.30:5000/';
    await window.open(`${baseUrl}${pdfLink}`, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <Header/>
      <h1 className="text-2xl font-bold mb-4">Admin Document Review</h1>
      {message.content && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.content}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Document Name</th>
              <th className="px-4 py-2 text-left">Document Type</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Upload Date</th>
              <th className="px-4 py-2 text-left">View PDF</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id} className="border-t border-gray-300">
                <td className="px-4 py-2">{doc.pdfName}</td>
                <td className="px-4 py-2">{doc.category}</td>
                <td className="px-4 py-2">{doc.subCategory}</td>
                <td className="px-4 py-2">{new Date(doc.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => viewPdf(doc.filePath)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAction(doc._id, 'approve')}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(doc._id, 'reject')}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer/>
    </div>
  );
};

export default AdminDocumentReview;
