import Header from '../Components/headerAdmin';
import Footer from '../Components/footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_BASE_URL = 'http://192.168.10.227:5000/api/'; // Define at the top for consistency


const emailCategories = {
  ALL_USERS: 'all_users',
  MANAGER_CREDIT: 'Credit',
  MANAGER_FINANCE: 'Finance',
  MANAGER_IT_DEPARTMENT: 'IT Department',
  MANAGER_HUMAN_RESOURCES: 'Human Resources',
  MANAGER_LEGAL: 'Legal',
  MANAGER_OPERATIONS: 'Operations',
};


const AdminDocumentReview = () => {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pdfs`);
      const unapprovedDocs = response.data.filter(doc => !doc.approval);
      setDocuments(unapprovedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setMessage({ type: 'error', content: 'Failed to fetch documents' });
    }
  };


// WITH THIS NEW CODE
const sendEmailNotification = async (action, documentInfo) => {
  try {
    const response = await axios.post('http://192.168.10.227:5000/api/sendemailMgt', {
      action,
      documentInfo
    });

    if (response.data.success) {
      console.log(`Email sent successfully for ${action} action`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


  const handleAction = async (id, action) => {
    setIsLoading(true);
    try {
      let doc;
      if (action === 'approve') {
        // Get document info first
        const docResponse = await axios.get(`${API_BASE_URL}/pdfs/${id}`);
        doc = docResponse.data;

        // Update document approval status
        const response = await axios.put(`${API_BASE_URL}/pdfs/${id}`, { 
          approval: true 
        });

        if (response.status === 200) {
          // Send email notification
          const emailSent = await sendEmailNotification('approve', doc);
          
          setMessage({ 
            type: 'success', 
            content: `Document approved successfully${emailSent ? ' and notification sent' : ''}` 
          });
        }
      } else if (action === 'reject') {
        // Get document info before deletion
        const getResponse = await axios.get(`${API_BASE_URL}/pdfs/${id}`);
        doc = getResponse.data;

        // Send email notification before deletion
        const emailSent = await sendEmailNotification('reject', doc);

        // Delete the document
        const deleteResponse = await axios.delete(`${API_BASE_URL}/pdfs/${id}`);
        if (deleteResponse.status === 200) {
          setMessage({ 
            type: 'success', 
            content: `Document rejected and deleted successfully${emailSent ? ' and notification sent' : ''}` 
          });
        }
      }

      fetchDocuments();
    } catch (error) {
      console.error(`Error performing ${action} on document:`, error);
      setMessage({ 
        type: 'error', 
        content: `Failed to ${action} document: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
    }
  };




  const viewPdf = async (pdfLink) => {
    const baseUrl = 'http://192.168.10.227:5000/';
    await window.open(`${baseUrl}${pdfLink}`, '_blank');
  };

  const formatDescription = (description) => {
    const words = description.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > 20) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header className="fixed top-0 left-0 right-0 z-10" />
      <main className="flex-grow mt-16 mb-16 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Admin Document Review</h1>
          {message.content && (
            <div className={`p-4 mb-4 rounded ${
              message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message.content}
            </div>
          )}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Document Name</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Document Type</th>
                  <th className="py-3 px-6 text-left">Department</th>
                  <th className="py-3 px-6 text-left">Upload Date</th>
                  <th className="py-3 px-6 text-center">View PDF</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600  text-lg">
                {documents.map((doc) => (
                  <tr key={doc._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left   whitespace-nowrap">{doc.pdfName}</td>
                    <td className="py-3 px-6 text-left  ">
                      <div className="h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <span className="inline-block">
                          {formatDescription(doc.pdfDescription)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left  ">{doc.category}</td>
                    <td className="py-3 px-6 text-left  ">{doc.subCategory}</td>
                    <td className="py-3 px-6 text-left  ">{new Date(doc.date).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => viewPdf(doc.filePath)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-50% transition duration-300 ease-in-out"
                      >
                        View
                      </button>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleAction(doc._id, 'approve')}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-50% transition duration-300 ease-in-out"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(doc._id, 'reject')}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-50% transition duration-300 ease-in-out"
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
      </main>
      <Footer className="fixed bottom-0 left-0 right-0 z-10" />
    </div>
  );
};

export default AdminDocumentReview;