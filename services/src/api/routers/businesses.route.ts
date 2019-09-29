import express from 'express';
import { checkSchema } from 'express-validator';

import * as BusinessesCtrl from '../controllers/businesses.ctrl';

import { ID } from '../validators/generic.val';
import { BusinessUpdate, BusinessCreate } from '../validators/businesses.val';

const router = express.Router();

router.get('', BusinessesCtrl.getBusinesses);
router.post('', checkSchema(BusinessCreate), BusinessesCtrl.postBusiness);
router.get('/:id', checkSchema(ID), BusinessesCtrl.getBusiness);
router.put('/:id', checkSchema(Object.assign({}, ID, BusinessUpdate)), BusinessesCtrl.putBusiness);
router.delete('/:id', checkSchema(ID), BusinessesCtrl.deleteBusiness);

export default router;
