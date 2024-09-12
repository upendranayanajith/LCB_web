import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from '../Components/header';
import Footer from '../Components/footer';

const Policies = () => {
  const [categories, setCategories] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const response = await axios.get('http://localhost:5000/api/categories');
        console.log('Categories fetched:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPdfs = async () => {
      try {
        console.log('Fetching PDFs...');
        const response = await axios.get('http://localhost:5000/api/pdfs');
        console.log('PDFs fetched:', response.data);
        setPdfs(response.data);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };

    fetchCategories();
    fetchPdfs();
  }, []);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div
        className="flex flex-1 flex-col sm:flex-row bg-cover bg-center"
        style={{ backgroundImage: "url('../assets/bg_img.svg')" }}
      >
        <main className="flex-1 p-12">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Policies</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <div key={category.id} className="w-full border border-gray-300 rounded-lg p-4 mb-4 bg-gray-200 col-span-1">
                <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 mb-4 text-gray-700">{category.categoryName}</h2>
                <ul className="list-none p-0">
                  {pdfs
                    .filter(pdf => pdf.subCategory === category.categoryName)
                    .map(pdf => (
                      <li key={pdf._id} className="mb-2">
                        {/* Linking to the correct file path on the server */}
                        <a href={`http://localhost:5000/${pdf.filePath}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {pdf.pdfName}
                        </a>
                        <p className="text-gray-600 inline-block ml-8"> - { pdf.pdfDescription}</p>
                        <p className="text-gray-600 inline-block ml-24">{formatDate(pdf.date)}</p>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Policies;
