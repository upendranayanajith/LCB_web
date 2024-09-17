import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Header from '../Components/header';
import Footer from '../Components/footer';
import PdfComp from '../Components/pdfComp';
import { pdfjs } from 'react-pdf'; // Import the PdfComp component
import { useNavigate } from 'react-router-dom';

const Policies = () => {
  const [categories, setCategories] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf] = useState(null); // To store the selected PDF file path
  const pdfViewerRef = useRef(null); // To scroll to PDF viewer
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPdfs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pdfs');
        setPdfs(response.data);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };

    fetchCategories();
    fetchPdfs();
  }, []);


  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handlePdfClick = (filePath) => {
    const encodedFilePath = encodeURIComponent(filePath); // Encode the file path
    navigate(`/pdfView/${encodedFilePath}`); // Navigate to the new page
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
                        {/* Triggering the custom PDF viewer instead of a new tab */}
                        <a 
                          onClick={() => handlePdfClick(pdf.filePath)} 
                          className="text-blue-500 hover:underline"
                        >
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
      
      {/* PDF Viewer Section */}
      <div ref={pdfViewerRef} className="pdf-viewer-container p-12">
        {selectedPdf ? (
          <>
            <h3 className="text-2xl font-bold mb-4">Selected PDF:</h3>
            <PdfComp pdfFile={selectedPdf} />
          </>
        ) : (
          <p>No PDF selected. Click a PDF to view it here.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Policies;
