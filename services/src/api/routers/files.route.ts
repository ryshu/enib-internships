import express from 'express';
import { checkSchema } from 'express-validator';

import * as FilesCtrl from '../controllers/files.ctrl';

import { ID } from '../validators/generic.val';
import { FileUpdate, FileCreate, FileList } from '../validators/files.val';

const router = express.Router();

router.get('', checkSchema(FileList), FilesCtrl.getFiles);
router.post('', checkSchema(FileCreate), FilesCtrl.postFile);
router.get('/:id', checkSchema(ID), FilesCtrl.getFile);
router.put('/:id', checkSchema(Object.assign({}, ID, FileUpdate)), FilesCtrl.putFile);
router.delete('/:id', checkSchema(ID), FilesCtrl.deleteFile);

export default router;
