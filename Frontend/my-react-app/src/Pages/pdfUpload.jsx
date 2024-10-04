import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Components/headerAdmin';
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
  const [sendEmail, setSendEmail] = useState(true); 

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

    try {
      const response = await axios.post(`http://192.168.10.30:5000/api/pdfupload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage('PDF uploaded successfully!');

if(sendEmail) {
 // Send email notification
 const emailSubject = `New ${category} Document Uploaded to Intranet`;
 const emailBody = `A new document "${pdfName}" has been uploaded to the Intranet. This is for ${pdfDescription} in ${subCategory} of ${category}. Please refer to it: <a href="http://192.168.10.30:443/home">Click Here</a>.`;

 
 try {
   await axios.post(`http://192.168.10.30:5000/api/sendemail`, {
     subject: emailSubject,
     body: emailBody
   });
   console.log('Email notification sent successfully');
 } catch (emailError) {
   console.error('Error sending email notification:', emailError);
 }

}

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
              <label className="block text-sm font-medium text-gray-700">PDF Description</label>
              <textarea
                value={pdfDescription}
                onChange={(e) => setPdfDescription(e.target.value)}
                placeholder="Enter PDF description"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 placeholder-gray-500 text-gray-700"
                required
              />
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 bg-gray-100"
                required
              />
            </div>
           
           
            <div className="flex items-center">
  <input
    type="checkbox"
    id="send-email-checkbox"
    checked={!sendEmail}
    onChange={() => setSendEmail(!sendEmail)}
    className="mr-2"
  />
  <label htmlFor="send-email-checkbox" className="text-sm text-gray-700">
    Don't send an acknowledge mail
  </label>
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
