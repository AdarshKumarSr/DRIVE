const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/download/:filePath', authMiddleware, async (req, res) => {
    const loggedInUserId = req.user.userId;  // Get logged-in user ID from the request user
    const filePath = req.params.filePath;     // Get the file path from the URL parameters

    try {
        // Find the file in the database by the logged-in user's ID and the file path (filename)
        const file = await filesModel.findOne({
            userId: loggedInUserId,
            filePath: filePath   // filePath should match the file name stored in the database
        });

        if (!file) {
            return res.status(404).json({
                message: 'File not found'
            });
        }

        // Resolve the absolute file path to the file in the 'uploads' folder
        const fileFullPath = path.resolve(__dirname, '../uploads', filePath);
        console.log("Resolved File Path:", fileFullPath);

        // Check if the file exists on the server
        if (!fs.existsSync(fileFullPath)) {
            console.error("File does not exist:", fileFullPath);
            return res.status(404).send("File not found");
        }

        // Send the file as a response to the user for download
        res.sendFile(fileFullPath, (err) => {
            if (err) {
                console.error('Error during file download:', err);
                return res.status(500).send('Error downloading the file');
            }
        });
    } catch (err) {
        console.error('Error fetching file:', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

module.exports = router;
