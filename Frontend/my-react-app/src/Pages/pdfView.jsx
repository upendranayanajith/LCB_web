import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PdfComp from '../Components/pdfComp';
import axios from 'axios';

const PdfView = () => {
  const { pdfPath } = useParams();
  const decodedPath = decodeURIComponent(pdfPath);
  const [pdfName, setPdfName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdfDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.10.30:5000/api/pdfs/`, {
          params: { path: decodedPath }
        });
        console.log('API Response:', response.data);

        if (response.data && response.data.pdfName) {
          setPdfName(response.data.pdfName);
        } else {
          console.error('pdfName not found in response');
          setPdfName('PDF Name Not Found');
        }
      } catch (error) {
        console.error('Error fetching PDF details:', error);
        setPdfName('Error Loading PDF Name');
      } finally {
        setLoading(false);
      }
    };

    fetchPdfDetails();
  }, [decodedPath]);

  return (
    <div className="pdf-viewer">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <PdfComp 
          pdfFile={`http://192.168.10.30:5000/${decodedPath}`} 
          pdfName={pdfName}
        />
      )}
    </div>
  );
};

export default PdfView;
