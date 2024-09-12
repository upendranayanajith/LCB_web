const fs = require('fs');
const { join } = require('path');
const Pdf = require('../Model/pdf.model');
const express = require('express');

const router = express.Router();

// Function to handle PDF upload
const uploadPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const { pdfName, pdfDescription, category, subCategory } = req.body;
        const filePath = req.file.path; // Make sure this is stored correctly

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
};

// Function to handle viewing a specific PDF file by PDF name (assuming the file is being stored with its original name)
const viewPdfs = (req, res) => {
    const pdfName = req.params.pdfName; // Fetching PDF name from request parameters
    const pdfPath = join(__dirname, '../uploads', pdfName); // Constructing the file path

    // Check if file exists before sending
    if (fs.existsSync(pdfPath)) {
        res.sendFile(pdfPath); // Serve the file
    } else {
        res.status(404).send('PDF not found');
    }
};

// Function to get all PDFs
const getAllPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find();
        res.status(200).json(pdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).send('Internal server error.');
    }
};

// Function to get a PDF by ID
const getPdfById = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) {
            return res.status(404).send('PDF not found.');
        }
        res.status(200).json(pdf);
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).send('Internal server error.');
    }
};

module.exports = {
    uploadPdf,
    viewPdfs,
    getAllPdfs,
    getPdfById,
};