import multer from 'multer';
import { v4 as uuid4 } from 'uuid';

/**
 * Set multer to handel image files.
 * Image files are saved to OS common tmp folder
 * and the images have always unique names.
 */
const storage = multer.diskStorage({
    /* destination: (req, file, cb) => {
        cb(null, './tmp');
    }, */
    filename: (req, file, cb) => {
        const suffix = uuid4();
        cb(null, file.fieldname + '_' + suffix + `.${file.mimetype.split('/')[1]}`);
    },
});

export const upload = multer({ storage });
