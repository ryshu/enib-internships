import express from 'express';
import { checkSchema } from 'express-validator';

import * as InternshipsCtrl from '../controllers/internships.ctrl';

import { ID } from '../validators/generic.val';
import { InternshipUpdate, InternshipCreate, InternshipsList } from '../validators/internships.val';

const router = express.Router();

router.get('', checkSchema(InternshipsList), InternshipsCtrl.getInternships);
router.post('', checkSchema(InternshipCreate), InternshipsCtrl.postInternship);
router.get('/:id', checkSchema(ID), InternshipsCtrl.getInternship);
router.put('/:id', checkSchema(Object.assign({}, ID, InternshipUpdate)), InternshipsCtrl.putInternship);
router.delete('/:id', checkSchema(ID), InternshipsCtrl.deleteInternship);

export default router;
