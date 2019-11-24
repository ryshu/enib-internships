import express from 'express';
import { checkSchema } from 'express-validator';

import * as BusinessesCtrl from '../controllers/businesses.ctrl';

import { ID, InternshipID } from '../validators/generic.val';
import { BusinessUpdate, BusinessCreate, BusinessesList } from '../validators/businesses.val';
import { InternshipsList } from '../validators/internships.val';

const router = express.Router();

// Businesses
router.get('', checkSchema(BusinessesList), BusinessesCtrl.getBusinesses);
router.post('', checkSchema(BusinessCreate), BusinessesCtrl.postBusiness);
router.get('/:id', checkSchema(ID), BusinessesCtrl.getBusiness);
router.put('/:id', checkSchema(Object.assign({}, ID, BusinessUpdate)), BusinessesCtrl.putBusiness);
router.delete('/:id', checkSchema(ID), BusinessesCtrl.deleteBusiness);

// Businesses internships
router.get(
    '/:id/internships',
    checkSchema(Object.assign({}, ID, InternshipsList)),
    BusinessesCtrl.getBusinessInternships,
);
router.post(
    '/:id/internships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    BusinessesCtrl.linkBusinessInternships,
);

export default router;
