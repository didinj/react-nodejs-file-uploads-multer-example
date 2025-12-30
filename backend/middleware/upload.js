const multer = require("multer");
const path = require("node:path");

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = /jpeg|jpg|png|pdf/;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  }
});

const fileFilter = (req, file, cb) => {
  const extname = ALLOWED_TYPES.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = ALLOWED_TYPES.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter
});

module.exports = upload;
