import express from 'express';
import { checkSchema } from 'express-validator';

import * as MentorsCtrl from '../controllers/mentors.ctrl';

import { ID } from '../validators/generic.val';
import { MentorUpdate, MentorCreate, MentorList } from '../validators/mentors.val';

const router = express.Router();

router.get('', checkSchema(MentorList), MentorsCtrl.getMentors);
router.post('', checkSchema(MentorCreate), MentorsCtrl.postMentor);
router.get('/:id', checkSchema(ID), MentorsCtrl.getMentor);
router.put('/:id', checkSchema(Object.assign({}, ID, MentorUpdate)), MentorsCtrl.putMentor);
router.delete('/:id', checkSchema(ID), MentorsCtrl.deleteMentor);

export default router;
