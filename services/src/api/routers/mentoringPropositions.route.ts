import express from 'express';
import { checkSchema } from 'express-validator';

import * as MentoringPropositionsCtrl from '../controllers/mentoringPropositions.ctrl';

import { ID } from '../validators/generic.val';
import { MentoringPropositionUpdate, MentoringPropositionCreate, MentoringPropositionsList } from '../validators/mentoringPropositions.val';

const router = express.Router();

router.get('', checkSchema(MentoringPropositionsList), MentoringPropositionsCtrl.getMentoringPropositions);
router.post('', checkSchema(MentoringPropositionCreate), MentoringPropositionsCtrl.postMentoringProposition);
router.get('/:id', checkSchema(ID), MentoringPropositionsCtrl.getMentoringProposition);
router.put('/:id', checkSchema(Object.assign({}, ID, MentoringPropositionUpdate)), MentoringPropositionsCtrl.putMentoringProposition);
router.delete('/:id', checkSchema(ID), MentoringPropositionsCtrl.deleteMentoringProposition);

export default router;
