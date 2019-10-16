import express from 'express';
import { checkSchema } from 'express-validator';

import * as InternshipsCtrl from '../controllers/internships.ctrl';

import { ID, BusinessID } from '../validators/generic.val';
import { InternshipUpdate, InternshipCreate, InternshipsList } from '../validators/internships.val';

const router = express.Router();

router.get('', checkSchema(InternshipsList), InternshipsCtrl.getInternships);
router.post('', checkSchema(InternshipCreate), InternshipsCtrl.postInternship);
router.get('/:id', checkSchema(ID), InternshipsCtrl.getInternship);
router.put(
    '/:id',
    checkSchema(Object.assign({}, ID, InternshipUpdate)),
    InternshipsCtrl.putInternship,
);
router.delete('/:id', checkSchema(ID), InternshipsCtrl.deleteInternship);

router.get('/:id/businesses', checkSchema(ID), InternshipsCtrl.getInternshipBusiness);
router.post(
    '/:id/businesses/:business_id/link',
    checkSchema(Object.assign({}, ID, BusinessID)),
    InternshipsCtrl.linkInternshipBusinesses,
);

export default router;
