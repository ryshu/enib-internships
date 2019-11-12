import httpStatus from 'http-status-codes';

import { APIError } from '../utils/error';

export const pdfFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: APIError | null, acceptFile: boolean) => void,
) => {
    // accept jpeg only
    if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new APIError('Only pdf files are allowed!', httpStatus.BAD_REQUEST, 1), false);
    }
    cb(null, true);
};
