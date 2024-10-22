import Header from '../Components/headerAdmin';
import Footer from '../Components/footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const emailCategories = {
  ADMIN: 'admin',
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

  useEffect(() => {
    fetchDocuments();
  }, []);

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

// const sendEmail = async (subject, body, recipient) => {
//   try {
//     const response = await axios.post('http://192.168.10.30:5000/api/sendEmail', {
//       subject,
//       body,
//       category:recipient,
//     });
//     if (response.status === 200) {
//       console.log(`Email sent successfully to ${recipient}`);
//     }
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };


const handleAction = async (id, action) => {
  try {
    let doc;
    if (action === 'approve') {
      const response = await axios.put(`http://192.168.10.30:5000/api/pdfs/${id}`, { approval: true });
      if (response.status === 200) {
        setMessage({ type: 'success', content: 'Document approved successfully' });
        doc = response.data;

        // // Send email to all users upon approval
        // const emailSubject = `New ${doc.category} Document Approved`;
        // const emailBody = `A new document "${doc.pdfName}" has been approved. It is for ${doc.pdfDescription} in ${doc.subCategory} of ${doc.category}. You can view it here: <a href="http://192.168.10.30:443/home">Click Here</a>.`;
        // await sendEmail(emailSubject, emailBody, emailCategories.ALL_USERS);
      }
    } else if (action === 'reject') {
      const getResponse = await axios.get(`http://192.168.10.30:5000/api/pdfs/${id}`);
      doc = getResponse.data;

      const deleteResponse = await axios.delete(`http://192.168.10.30:5000/api/pdfs/${id}`);
      if (deleteResponse.status === 200) {
        setMessage({ type: 'success', content: 'Document rejected and deleted successfully' });

        // Send email to manager about rejection
        // const emailSubject = `${doc.category} Document Rejected`;
        // const emailBody = `A document "${doc.pdfName}" has been rejected. It was for ${doc.pdfDescription} in ${doc.subCategory} of ${doc.category}.`;

        // Determine the correct manager category based on the document's subCategory
        // const managerCategory = `MANAGER_${doc.subCategory.toUpperCase().replace(/\s+/g, '_')}`;
        // if (emailCategories.hasOwnProperty(managerCategory)) {
        //   const recipient = emailCategories[managerCategory];
        //   console.log(`Sending email to ${managerCategory}: ${recipient}`);
        //   await sendEmail(emailSubject, emailBody, recipient);
        // } else {
        //   console.error(`No email category found for ${managerCategory}`);
        // }
      }
    }


    fetchDocuments();
  } catch (error) {
    console.error(`Error performing ${action} on document:`, error);
    setMessage({ type: 'error', content: `Failed to ${action} document` });
  }
};




  const viewPdf = async (pdfLink) => {
    const baseUrl = 'http://192.168.10.30:5000/';
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