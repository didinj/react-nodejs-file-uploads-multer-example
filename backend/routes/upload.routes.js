const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

// Single file upload
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "File uploaded successfully",
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: `/uploads/${req.file.filename}`
    }
  });
});

// Multiple file upload
router.post("/uploads", upload.array("files", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    path: `/uploads/${file.filename}`
  }));

  res.status(200).json({
    message: "Files uploaded successfully",
    files: uploadedFiles
  });
});

module.exports = router;
