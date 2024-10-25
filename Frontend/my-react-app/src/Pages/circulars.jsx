import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from '../Components/header';
import Footer from '../Components/footer';
import CategoryCard from '../Components/pdfCard';

const Circulars = () => {
  const [categories, setCategories] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [searchQueries, setSearchQueries] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://192.168.10.227:5000/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPdfs = async () => {
      try {
        const response = await axios.get(`http://192.168.10.227:5000/api/pdfs`);
        const filteredPdfs = response.data.filter(pdf => pdf.category === 'Circulars' && pdf.pdfStatus === true);
        setPdfs(filteredPdfs);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };

    fetchCategories();
    fetchPdfs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handlePdfClick = (filePath) => {
    const fullPath = `http://192.168.10.227:5000/${filePath}`;
    window.open(fullPath, '_blank');
  };

  const handleSearchChange = (e, categoryId) => {
    setSearchQueries((prevQueries) => ({
      ...prevQueries,
      [categoryId]: e.target.value,
    }));
  };

  const getSearchQueryForCategory = (categoryId) => {
    return searchQueries[categoryId] || '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div
        className="flex flex-1 flex-col sm:flex-row bg-cover bg-center"
        style={{ backgroundImage: "url('../assets/bg_img.svg')" }}
      >
        <main className="flex-1 p-12">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Circulars</h1>
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
      <Footer />
    </div>
  );
};

export default Circulars;