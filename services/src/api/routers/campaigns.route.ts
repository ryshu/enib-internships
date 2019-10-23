import express from 'express';
import { checkSchema } from 'express-validator';

import * as CampaignsCtrl from '../controllers/campaigns.ctrl';

import { ID, MentoringPropositionID, InternshipID } from '../validators/generic.val';
import { CampaignUpdate, CampaignCreate, CampaignList } from '../validators/campaigns.val';

const router = express.Router();

router.get('', checkSchema(CampaignList), CampaignsCtrl.getCampaigns);
router.post('', checkSchema(CampaignCreate), CampaignsCtrl.postCampaign);
router.get('/:id', checkSchema(ID), CampaignsCtrl.getCampaign);
router.put('/:id', checkSchema(Object.assign({}, ID, CampaignUpdate)), CampaignsCtrl.putCampaign);
router.delete('/:id', checkSchema(ID), CampaignsCtrl.deleteCampaign);

router.get(
    '/:id/mentoringPropositions',
    checkSchema(ID),
    CampaignsCtrl.getCampaignMentoringPropositions,
);
router.post(
    '/:id/mentoringPropositions/:mentoring_proposition_id/link',
    checkSchema(Object.assign({}, ID, MentoringPropositionID)),
    CampaignsCtrl.linkCampaignMentoringPropositions,
);
router.get(
  '/:id/validatedInternships',
  checkSchema(ID),
  CampaignsCtrl.getValidatedCampaignInternships,
);
router.post(
  '/:id/validatedInternships/:internship_id/link',
  checkSchema(Object.assign({}, ID, InternshipID)),
  CampaignsCtrl.linkValidatedCampaignInternships,
);
router.get(
  '/:id/availableInternships',
  checkSchema(ID),
  CampaignsCtrl.getAvailableCampaignInternships,
);
router.post(
  '/:id/availableInternships/:internship_id/link',
  checkSchema(Object.assign({}, ID, InternshipID)),
  CampaignsCtrl.linkAvailableCampaignInternships,
);

export default router;
