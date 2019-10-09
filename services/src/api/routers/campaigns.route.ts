import express from 'express';
import { checkSchema } from 'express-validator';

import * as CampaignsCtrl from '../controllers/campaigns.ctrl';

import { ID } from '../validators/generic.val';
import { CampaignUpdate, CampaignCreate} from '../validators/campaigns.val';

const router = express.Router();

router.get('', CampaignsCtrl.getCampaigns);
router.post('', checkSchema(CampaignCreate), CampaignsCtrl.postCampaign);
router.get('/:id', checkSchema(ID), CampaignsCtrl.getCampaign);
router.put('/:id', checkSchema(Object.assign({}, ID, CampaignUpdate)), CampaignsCtrl.putCampaign);
router.delete('/:id', checkSchema(ID), CampaignsCtrl.deleteCampaign);

export default router;
