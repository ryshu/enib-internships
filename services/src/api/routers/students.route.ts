import express from 'express';
import { checkSchema } from 'express-validator';

import * as StudentsCtrl from '../controllers/students.ctrl';

import { ID, InternshipID } from '../validators/generic.val';
import { StudentUpdate, StudentCreate, StudentList } from '../validators/students.val';

const router = express.Router();

router.get('', checkSchema(StudentList), StudentsCtrl.getStudents);
router.post('', checkSchema(StudentCreate), StudentsCtrl.postStudent);
router.get('/:id', checkSchema(ID), StudentsCtrl.getStudent);
router.put('/:id', checkSchema(Object.assign({}, ID, StudentUpdate)), StudentsCtrl.putStudent);
router.delete('/:id', checkSchema(ID), StudentsCtrl.deleteStudent);

router.get('/:id/internships', checkSchema(ID), StudentsCtrl.getStudentInternships);
router.post(
    '/:id/internships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    StudentsCtrl.linkStudentInternships,
);

export default router;
