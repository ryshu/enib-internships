import express from 'express';
import { checkSchema } from 'express-validator';

import * as PropositionsCtrl from '../controllers/mentoring.propositions.ctrl';

import { ID, CampaignID, MentorID, InternshipID } from '../validators/generic.val';
import { InternshipsList } from '../validators/internships.val';
import {
    MentoringPropositionUpdate,
    MentoringPropositionCreate,
    MentoringPropositionsList,
} from '../validators/mentoringPropositions.val';

const router = express.Router();

// Mentoring propositions
router.get('', checkSchema(MentoringPropositionsList), PropositionsCtrl.getMentoringPropositions);
router.post('', checkSchema(MentoringPropositionCreate), PropositionsCtrl.postMentoringProposition);
router.get('/:id', checkSchema(ID), PropositionsCtrl.getMentoringProposition);
router.put(
    '/:id',
    checkSchema(Object.assign({}, ID, MentoringPropositionUpdate)),
    PropositionsCtrl.putMentoringProposition,
);
router.delete('/:id', checkSchema(ID), PropositionsCtrl.deleteMentoringProposition);

// Mentoring proposition's campaign
router.get('/:id/campaigns', checkSchema(ID), PropositionsCtrl.getMentoringPropositionCampaigns);
router.post(
    '/:id/campaigns/:campaign_id/link',
    checkSchema(Object.assign({}, ID, CampaignID)),
    PropositionsCtrl.linkMentoringPropositionCampaign,
);

router.get('/:id/mentors', checkSchema(ID), PropositionsCtrl.getMentoringPropositionMentor);
router.post(
    '/:id/mentors/:mentor_id/link',
    checkSchema(Object.assign({}, ID, MentorID)),
    PropositionsCtrl.linkMentoringPropositionMentor,
);

router.get(
    '/:id/internships',
    checkSchema(Object.assign({}, ID, InternshipsList)),
    PropositionsCtrl.getMentoringPropositionInternship,
);
router.post(
    '/:id/internships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    PropositionsCtrl.linkMentoringPropositionInternship,
);

export default router;
