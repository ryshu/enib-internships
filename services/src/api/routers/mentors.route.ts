import express from 'express';
import { checkSchema } from 'express-validator';

import * as MentorsCtrl from '../controllers/mentors.ctrl';

import { ID, CampaignID, InternshipID, MentoringPropositionID } from '../validators/generic.val';
import { MentorUpdate, MentorCreate, MentorList } from '../validators/mentors.val';

const router = express.Router();

// Mentors
router.get('', checkSchema(MentorList), MentorsCtrl.getMentors);
router.post('', checkSchema(MentorCreate), MentorsCtrl.postMentor);
router.get('/:id', checkSchema(ID), MentorsCtrl.getMentor);
router.put('/:id', checkSchema(Object.assign({}, ID, MentorUpdate)), MentorsCtrl.putMentor);
router.delete('/:id', checkSchema(ID), MentorsCtrl.deleteMentor);

// Mentors campaigns
router.get('/:id/campaigns', checkSchema(ID), MentorsCtrl.getMentorCampaigns);
router.post(
    '/:id/campaigns/:campaign_id/link',
    checkSchema(Object.assign({}, ID, CampaignID)),
    MentorsCtrl.linkMentorCampaign,
);

// Mentors propositions
router.get('/:id/propositions', checkSchema(ID), MentorsCtrl.getMentorPropositions);
router.post(
    '/:id/propositions/:mentoring_proposition_id/link',
    checkSchema(Object.assign({}, ID, MentoringPropositionID)),
    MentorsCtrl.linkMentorProposition,
);

// Mentors internships
router.get('/:id/internships', checkSchema(ID), MentorsCtrl.getMentorInternships);
router.post(
    '/:id/internships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    MentorsCtrl.linkMentorInternship,
);

export default router;
