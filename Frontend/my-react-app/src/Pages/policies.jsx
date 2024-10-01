import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Header from '../Components/header';
import Footer from '../Components/footer';
import PdfComp from '../Components/pdfComp';
import { pdfjs } from 'react-pdf';
import CategoryCard from '../Components/pdfCard'; // Import the new CategoryCard component
import { useNavigate } from 'react-router-dom';

const Policies = () => {
  const [categories, setCategories] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf] = useState(null); // To store the selected PDF file path
  const [searchQueries, setSearchQueries] = useState({}); // Object to store search queries for each category
  const pdfViewerRef = useRef(null); // To scroll to PDF viewer
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://192.168.10.30:5000/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPdfs = async () => {
      try {
        const response = await axios.get(`http://192.168.10.30:5000/api/pdfs`);
        const filteredPdfs = response.data.filter(pdf => pdf.category === 'Policies');
        setPdfs(filteredPdfs);
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

  const handleSearchChange = (e, categoryId) => {
    setSearchQueries((prevQueries) => ({
      ...prevQueries,
      [categoryId]: e.target.value, // Update search query for the specific category
    }));
  };

  const getSearchQueryForCategory = (categoryId) => {
    return searchQueries[categoryId] || ''; // Return search query for the category or empty string
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
              <CategoryCard 
                key={category.id}
                category={category}
                searchQuery={getSearchQueryForCategory(category.id)}
                onSearchChange={handleSearchChange}
                pdfs={pdfs}
                formatDate={formatDate}
                handlePdfClick={handlePdfClick}
              />
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
+
      <Footer />
    </div>
  );
};

export default Policies;
