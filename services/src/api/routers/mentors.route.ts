import express from 'express';
import { checkSchema } from 'express-validator';

import * as MentorsCtrl from '../controllers/mentors.ctrl';

import { ID, CampaignID } from '../validators/generic.val';
import { MentorUpdate, MentorCreate, MentorList } from '../validators/mentors.val';

const router = express.Router();

router.get('', checkSchema(MentorList), MentorsCtrl.getMentors);
router.post('', checkSchema(MentorCreate), MentorsCtrl.postMentor);
router.get('/:id', checkSchema(ID), MentorsCtrl.getMentor);
router.put('/:id', checkSchema(Object.assign({}, ID, MentorUpdate)), MentorsCtrl.putMentor);
router.delete('/:id', checkSchema(ID), MentorsCtrl.deleteMentor);

router.get('/:id/campaigns', checkSchema(ID), MentorsCtrl.getMentorCampaigns);
router.post(
    '/:id/campaigns/:campaign_id/link',
    checkSchema(Object.assign({}, ID, CampaignID)),
    MentorsCtrl.linkMentorCampaign,
);

export default router;
