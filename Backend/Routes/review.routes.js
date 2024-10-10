const express = require('express');
const multer = require('multer');
const Review = require('../Model/review.model'); // Assuming you have a Review model defined
const { viewReviews, getAllReviews, getReviewById, updateReview, deleteReview } = require('../Controller/review.controller'); // Import the controller functions
const path = require('path');
const { send } = require('process');
const { sendEmail } = require('../emailServer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/reviewupload', upload.single('file'), async (req, res) => {
  console.log('Headers:', req.headers);
  console.log('File:', req.file);
  console.log('Body:', req.body);
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { reviewName, reviewDescription, category, subCategory } = req.body;
    const filePath = req.file.path;

    const newReview = new Review({
      reviewName,
      reviewDescription,
      category,
      subCategory,
      filePath
    });

    await newReview.save();

    res.status(201).send('File uploaded and data saved successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal server error.');
  }
});

router.post('/sendemail', async (req, res) => {
  const { subject, body, to } = req.body;

  try {
    const info = await sendEmail(subject, body, to);
    res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});


router.get('/reviews', getAllReviews);
router.get('/reviews/:id', getReviewById);
router.put('/reviews/:id', updateReview)
router.delete('/reviews/:id', deleteReview);

module.exports = router;