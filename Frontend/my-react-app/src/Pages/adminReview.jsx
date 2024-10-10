import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [activeTab, setActiveTab] = useState('documents');

  useEffect(() => {
    fetchDocuments();
    fetchReviews();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://192.168.10.30:5000/api/reviews');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setMessage({ type: 'error', content: 'Failed to fetch documents' });
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://192.168.10.30:5000/api/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setMessage({ type: 'error', content: 'Failed to fetch reviews' });
    }
  };
  const handleAction = async (doc, action) => {
    try {
      if (action === 'approve') {
        // Check if doc.file is a valid File object; otherwise, fetch it or create a Blob
        const fileResponse = await axios.get(doc.filePath, { responseType: 'blob' }); // Assuming filePath points to the document file
        const fileBlob = new Blob([fileResponse.data], { type: fileResponse.headers['content-type'] });
        const formData = new FormData();
        formData.append('id', doc.id);
        formData.append('file', fileBlob, doc.reviewName); // Include the file name as the third parameter
  
        // Upload the file
        await axios.post('http://192.168.10.30:5000/api/pdfupload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      // Regardless of action, delete the document from reviews
      await axios.delete(`http://192.168.10.30:5000/api/reviews/${doc.id}`);
  
      setMessage({
        type: 'success',
        content: action === 'approve'
          ? 'Document approved and moved to uploadpdfs successfully'
          : 'Document rejected and removed successfully',
      });
      // Refresh documents and reviews
      fetchDocuments();
      fetchReviews();
    } catch (error) {
      console.error(`Error ${action}ing document:`, error);
      let errorMessage = `Failed to ${action} document`;
      if (error.response) {
        errorMessage += `: ${error.response.data}`;
      }
      setMessage({ type: 'error', content: errorMessage });
    }
  };
  

  const viewPdf = (pdfLink) => {
    const fullPdfLink = `http://192.168.10.30:5000/${pdfLink}`;
    window.open(fullPdfLink, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {message.content && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.content}
        </div>
      )}
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'documents' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('documents')}
        >
          Pending Documents
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'reviews' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>
      <div className="overflow-x-auto">
        {activeTab === 'documents' && (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">PDF Name</th>
                <th className='px-4 py-2 text-left'>Description</th>
                <th className="px-4 py-2 text-left">Document Type</th>
                <th className="px-4 py-2 text-left">Department</th>
             
                <th className="px-4 py-2 text-left">Upload Date</th>
                <th className="px-4 py-2 text-left">View PDF</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t border-gray-300">
                  <td className="px-4 py-2">{doc.reviewName}</td>
                  <td className="px-4 py-2">{doc.reviewDescription}</td>
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
                        onClick={() => handleAction(doc, 'approve')}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(doc, 'reject')}
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
        )}
        {activeTab === 'reviews' && (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">PDF Name</th>
                <th className="px-4 py-2 text-left">Reviewer Name</th>
                <th className="px-4 py-2 text-left">Review Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-t border-gray-300">
                  <td className="px-4 py-2">{review.pdfName}</td>
                  <td className="px-4 py-2">{review.reviewerName}</td>
                  <td className="px-4 py-2">{new Date(review.reviewDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${
                      review.status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{review.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;