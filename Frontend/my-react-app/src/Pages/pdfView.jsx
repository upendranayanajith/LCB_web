import { useParams } from 'react-router-dom';
import PdfComp from '../Components/pdfComp';

const PdfView = () => {
  const { pdfPath } = useParams();
  const decodedPath = decodeURIComponent(pdfPath);

  return (
    <div className="pdf-viewer">
      <PdfComp file={decodedPath} />
    </div>
  );
};

export default PdfView;