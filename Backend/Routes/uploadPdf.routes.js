const express = require('express');
const multer = require('multer');
const Pdf = require('../Model/pdf.model'); // Assuming you have a Pdf model defined
const { viewPdfs, getAllPdfs, getPdfById, updatePdf, deletePdf } = require('../Controller/pdf.controller'); // Import the controller functions


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/pdfupload', upload.single('file'), async (req, res) => {
  console.log('Headers:', req.headers);
  console.log('File:', req.file);
  console.log('Body:', req.body);
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { pdfName, pdfDescription, category, subCategory } = req.body;
    const filePath = req.file.path;

    const newPdf = new Pdf({
      pdfName,
      pdfDescription,
      category,
      subCategory,
      filePath
    });

    await newPdf.save();

    res.status(201).send('File uploaded and data saved successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal server error.');
  }
});

router.get('/pdfs', getAllPdfs);


router.get('/pdfs/:id', getPdfById);

router.put('/pdfs/:id', updatePdf)

router.delete('/pdfs/:id', deletePdf);


module.exports = router;