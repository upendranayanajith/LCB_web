import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PdfComp from '../Components/pdfComp';

const PdfView = () => {
  const { pdfPath } = useParams();
  const decodedPath = decodeURIComponent(pdfPath); // Decode the file path
  const [pdfName, setPdfName] = useState('');
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    // Function to fetch PDF details from the database
    const fetchPdfDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pdfs?path=${decodedPath}`);
        const data = await response.json();
        console.log('API Response:', data); // Log the response to check the structure

        if (data && data.pdfName) {
          setPdfName(data.pdfName); // Set the pdfName from the response
        } else {
          console.error('pdfName not found in response');
        }
      } catch (error) {
        console.error('Error fetching PDF details:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPdfDetails();
  }, [decodedPath]);

  return (
    <div className="pdf-viewer">
      {loading ? (
        <p>Loading...</p> // Display a loading message while fetching the PDF name
      ) : (
        <h1 className="text-2xl font-bold mb-6">{pdfName || 'PDF Name Not Found'}</h1> // Display the PDF name or a fallback
      )}
      <PdfComp pdfFile={`http://localhost:5000/${decodedPath}`} /> {/* Pass the full URL */}
    </div>
  );
};

export default PdfView;
