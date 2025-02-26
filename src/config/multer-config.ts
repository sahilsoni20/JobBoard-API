import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

// Define upload directory
const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const multerConfig = {
  storage: diskStorage({
    destination: uploadDir, // Save resumes in the correct folder
    filename: (req, file, cb) => {
      const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file) {
      cb(new Error('No file provided'), false);
    } else if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed!'), false);
    } else {
      cb(null, true);
    }
  },
};
