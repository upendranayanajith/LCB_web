import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../Components/headerManager';
import Footer from '../Components/footer';



const PdfUpload = () => {
  const [pdfName, setPdfName] = useState('');
  const [pdfDescription, setPdfDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [wordCount, setWordCount] = useState(0); // Word count state
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://192.168.10.30:5000/api/categories`);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setPdfDescription(value);
      setWordCount(value.length); // Update word count
    }
  };



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




  const sendEmail = async (subject, body, recipient) => {
    try {
      const response = await axios.post('http://192.168.10.30:5000/api/sendEmail', {
        subject,
        body,
        category: recipient,
      });
      if (response.status === 200) {
        console.log('Email sent successfully');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };






  const sendAdminNotification = async (doc) => {
    const emailSubject = `New ${doc.category} Document Awaiting Approval`;
    const emailBody = `A new document "${doc.pdfName}" has been uploaded for approval. It is for ${doc.pdfDescription} in ${doc.subCategory} of ${doc.category}. Please review it: <a href="http://192.168.10.30:443/homeAdmin">Click Here</a>.<br><br>Note: Please check before approving.`;
    await sendEmail(emailSubject, emailBody, emailCategories.ADMIN);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
  
    if (!pdfName || !pdfDescription || !category || !subCategory || !file) {
      setErrorMessage('All fields are required');
      return;
    }
  
    const formData = new FormData();
    formData.append('pdfName', pdfName);
    formData.append('pdfDescription', pdfDescription);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('file', file);
    formData.append('approval', false);
  
    try {
      const response = await axios.post(`http://192.168.10.30:5000/api/pdfupload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 201 || response.status === 200) {
        setSuccessMessage('PDF uploaded successfully!');
        
        // Send email notification to admin
        await sendAdminNotification(response.data);
  
        setPdfName('');
        setPdfDescription('');
        setCategory('');
        setSubCategory('');
        setFile(null);
      } else {
        setErrorMessage('Failed to upload the PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file', error);
      setErrorMessage('Error uploading file. Please try again.');
    }
  };


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCancelFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };



  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full">
          <h1 className="text-2xl font-bold mb-4 text-blue-900">PDF Upload Component</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">PDF Name</label>
              <input
                type="text"
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                placeholder="Enter PDF name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 placeholder-gray-500 text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">PDF Description (Max 100 characters)</label>
              <textarea
                value={pdfDescription}
                onChange={handleDescriptionChange}
                placeholder="Enter PDF description"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 placeholder-gray-500 text-gray-700"
                required
              />
              <p className="text-sm text-gray-500 mt-1">{wordCount}/100 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 text-gray-700"
                required
              >
                <option value="" className="text-gray-500">Select a category</option>
                <option value="Circulars">Circulars</option>
                <option value="Policies">Policies</option>
                <option value="Tutorials">Tutorials</option>
                <option value="Applications">Applications</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                required
              >
                <option value="">Select a department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department.categoryName}>
                    {department.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-1 flex items-center">
  <input
    type="file"
    accept="application/pdf"
    onChange={handleFileChange}
    className="flex-grow block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 bg-gray-100"
    required
    ref={fileInputRef}
  />
  <button
    type="button"
    onClick={handleCancelFile}
    className={`ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      file ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-gray-400 cursor-not-allowed'
    }`}
    disabled={!file}  // Button disabled if no file is selected
  >
    ✕
  </button>
</div>

            
            <div>
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PdfUpload;