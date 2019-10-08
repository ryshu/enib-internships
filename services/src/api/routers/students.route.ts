import express from 'express';
import { checkSchema } from 'express-validator';

import * as StudentsCtrl from '../controllers/students.ctrl';

import { ID } from '../validators/generic.val';
import { StudentUpdate, StudentCreate, StudentList } from '../validators/students.val';

const router = express.Router();

router.get('', checkSchema(StudentList), StudentsCtrl.getStudents);
router.post('', checkSchema(StudentCreate), StudentsCtrl.postStudent);
router.get('/:id', checkSchema(ID), StudentsCtrl.getStudent);
router.put('/:id', checkSchema(Object.assign({}, ID, StudentUpdate)), StudentsCtrl.putStudent);
router.delete('/:id', checkSchema(ID), StudentsCtrl.deleteStudent);

export default router;
