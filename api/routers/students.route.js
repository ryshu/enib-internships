"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const StudentsCtrl = __importStar(require("../controllers/students.ctrl"));
const generic_val_1 = require("../validators/generic.val");
const students_val_1 = require("../validators/students.val");
const router = express_1.default.Router();
router.get('', express_validator_1.checkSchema(students_val_1.StudentList), StudentsCtrl.getStudents);
router.post('', express_validator_1.checkSchema(students_val_1.StudentCreate), StudentsCtrl.postStudent);
router.get('/:id', express_validator_1.checkSchema(generic_val_1.ID), StudentsCtrl.getStudent);
router.put('/:id', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, students_val_1.StudentUpdate)), StudentsCtrl.putStudent);
router.delete('/:id', express_validator_1.checkSchema(generic_val_1.ID), StudentsCtrl.deleteStudent);
router.get('/:id/internships', express_validator_1.checkSchema(generic_val_1.ID), StudentsCtrl.getStudentInternships);
router.post('/:id/internships/:internship_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.InternshipID)), StudentsCtrl.linkStudentInternships);
exports.default = router;
//# sourceMappingURL=students.route.js.map