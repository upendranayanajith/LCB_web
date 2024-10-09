import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDocumentReview = () => {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://192.168.10.30:5000/api/pending-documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setMessage({ type: 'error', content: 'Failed to fetch documents' });
    }
  };

  const handleAction = async (id, action) => {
    try {
      const response = await axios.post(`http://192.168.10.30:5000/api/document-action/${id}`, { action });
      if (response.status === 200) {
        setMessage({ type: 'success', content: `Document ${action}ed successfully` });
        fetchDocuments(); // Refresh the document list
      }
    } catch (error) {
      console.error(`Error ${action}ing document:`, error);
      setMessage({ type: 'error', content: `Failed to ${action} document` });
    }
  };

  const viewPdf = (pdfLink) => {
    window.open(pdfLink, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
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
              <th className="px-4 py-2 text-left">PDF Name</th>
              <th className="px-4 py-2 text-left">Uploader Name</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Upload Date</th>
              <th className="px-4 py-2 text-left">View PDF</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t border-gray-300">
                <td className="px-4 py-2">{doc.pdfName}</td>
                <td className="px-4 py-2">{doc.uploaderName}</td>
                <td className="px-4 py-2">{doc.department}</td>
                <td className="px-4 py-2">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => viewPdf(doc.pdfLink)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAction(doc.id, 'approve')}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(doc.id, 'reject')}
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
    </div>
  );
};

export default AdminDocumentReview;