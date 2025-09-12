import multer from "multer";

// Store files in memory instead of saving to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
