const fs = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const Review = require('../Model/review.model');
const { StatusCodes } = require('http-status-codes');
const { sendEmail } = require('../emailServer');

const unlinkAsync = promisify(fs.unlink);

// Function to handle REVIEW upload
const uploadReview = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded.' });
        }
        const { reviewName, reviewDescription, category, subCategory } = req.body;
        const filePath = req.file.path;

        const newReview = new Review({
            reviewName,
            reviewDescription,
            category,
            subCategory,
            filePath,
            reviewStatus: true // Assuming new REVIEWs are active by default
        });

        const savedReview = await newReview.save();
        console.log('REVIEW saved successfully:', savedReview);

         // Send email notification
         const emailSubject = 'New Document Uploaded to Intranet';
         const emailBody = `A new document "${savedReview.reviewName}" has been uploaded to the intranet. This is for ${savedReview.reviewDescription} in ${savedReview.subCategory} of ${savedReview.category}. Please refer to it.`;
         await sendEmail(emailSubject, emailBody);

        res.status(StatusCodes.CREATED).json({ message: 'File uploaded and data saved successfully.', review: savedReview });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.', error: error.message });
    }
};

// Function to handle viewing a specific REVIEW file by REVIEW name
const viewReviews = (req, res) => {
    const reviewName = req.params.reviewName;
    const reviewPath = join(__dirname, '../uploads', reviewName);

    if (fs.existsSync(reviewPath)) {
        res.sendFile(reviewPath);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'REVIEW not found' });
    }
};

// Function to get all REVIEWs
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(StatusCodes.OK).json(reviews);
    } catch (error) {
        console.error('Error fetching REVIEWs:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.', error: error.message });
    }
};

// Function to get a REVIEW by ID
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'REVIEW not found.' });
        }
        res.status(StatusCodes.OK).json(review);
    } catch (error) {
        console.error('Error fetching REVIEW:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.', error: error.message });
    }
};

// Function to update a REVIEW
const updateReview = async (req, res) => {
    const { id } = req.params;
    console.log('Attempting to update REVIEW with id:', id);
    console.log('Update data:', req.body);
    try {
        const review = await Review.findByIdAndUpdate(id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!review) {
            console.log('No REVIEW found with id:', id);
            return res.status(StatusCodes.NOT_FOUND).json({ message: `No REVIEW with id: ${id}` });
        }
        console.log('REVIEW updated successfully:', review);
        res.status(StatusCodes.OK).json(review);
    } catch (error) {
        console.error('Error updating REVIEW:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating REVIEW', error: error.message });
    }
};

// Function to delete a REVIEW
const deleteReview = async (req, res) => {
    const { id } = req.params;
    console.log('Attempting to delete REVIEW with id:', id);
    try {
        const review = await Review.findById(id);
        if (!review) {
            console.log('No REVIEW found with id:', id);
            return res.status(StatusCodes.NOT_FOUND).json({ message: `No REVIEW with id: ${id}` });
        }
        
        // Delete the file from the filesystem
        try {
            await unlinkAsync(review.filePath);
            console.log('File deleted successfully from filesystem');
        } catch (unlinkError) {
            console.error('Error deleting file from filesystem:', unlinkError);
            // Continue with deletion from database even if file deletion fails
        }

        // Remove the REVIEW document from the database
        await Review.findByIdAndDelete(id);
        
        console.log('REVIEW deleted successfully');
        res.status(StatusCodes.OK).json({ message: 'REVIEW deleted successfully' });
    } catch (error) {
        console.error('Error deleting REVIEW:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting REVIEW', error: error.message });
    }
};

module.exports = {
    uploadReview,
    viewReviews,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
};