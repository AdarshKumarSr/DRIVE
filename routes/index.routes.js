const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const userModel = require('../models/user.model'); // Ensure this path is correct
const filesModel = require('../models/files.model');
const fs = require('fs');
const path = require('path');
// const file = require()



// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
        // cb(null, `${req.user.userId}-${uniqueSuffix}-${file.originalname}`); // Include userId in the file name

    }
});

// Initialize multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    }
});

// Render home page with file upload form

router.get('/home', authMiddleware, async (req, res) => {
    try {
        console.log('User Info:', req.user);  // Check the user info here
        const userFiles = await filesModel.find({ userId: req.user.userId });
        console.log('User Files:', userFiles);
        res.render('home', { files: userFiles });
    } catch (err) {
        console.error('Error fetching user files:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle file upload

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        console.log('Uploaded File:', req.file);

        // Save the file details to the database
        const newFile = new filesModel({
            fileName: req.file.originalname,
            filePath: req.file.path,
            userId: req.user.userId  // Save the userId to associate the file with the user
        });

        // Save the file to the database
        await newFile.save();

        res.status(200).json({
            message: 'File uploaded successfully',
            file: req.file
        });
    } catch (err) {
        console.error('Upload Error:', err.message);
        res.status(500).json({
            message: 'Error uploading file',
            error: err.message
        });
    }
});


module.exports = router;