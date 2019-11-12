import express from 'express';
import { checkSchema } from 'express-validator';

import * as FilesCtrl from '../controllers/files.ctrl';

import { ID, InternshipID } from '../validators/generic.val';
import { FileUpdate, FileCreate, FileList } from '../validators/files.val';
import { uploadHandler } from '../../files-storage/base';

const router = express.Router();

// Files
router.get('', checkSchema(FileList), FilesCtrl.getFiles);
router.post('', uploadHandler.single('file'), checkSchema(FileCreate), FilesCtrl.postFile);
router.get('/:id', checkSchema(ID), FilesCtrl.getFile);
router.put('/:id', checkSchema(Object.assign({}, ID, FileUpdate)), FilesCtrl.putFile);
router.delete('/:id', checkSchema(ID), FilesCtrl.deleteFile);

// Internships' files
router.get('/:id/internships', checkSchema(ID), FilesCtrl.getFileInternship);
router.post(
    '/:id/internships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    FilesCtrl.linkFilesInternship,
);

export default router;
