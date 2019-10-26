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
const InternshipsCtrl = __importStar(require("../controllers/internships.ctrl"));
const generic_val_1 = require("../validators/generic.val");
const internships_val_1 = require("../validators/internships.val");
const router = express_1.default.Router();
// Default internships routes
router.get('', express_validator_1.checkSchema(internships_val_1.InternshipsList), InternshipsCtrl.getInternships);
router.post('', express_validator_1.checkSchema(internships_val_1.InternshipCreate), InternshipsCtrl.postInternship);
router.get('/:id', express_validator_1.checkSchema(generic_val_1.ID), InternshipsCtrl.getInternship);
router.put('/:id', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, internships_val_1.InternshipUpdate)), InternshipsCtrl.putInternship);
router.delete('/:id', express_validator_1.checkSchema(generic_val_1.ID), InternshipsCtrl.deleteInternship);
// Routes for internships-businesses association
router.get('/:id/businesses', express_validator_1.checkSchema(generic_val_1.ID), InternshipsCtrl.getInternshipBusiness);
router.post('/:id/businesses/:business_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.BusinessID)), InternshipsCtrl.linkInternshipBusinesses);
// Routes for internships-internshipTypes association
router.get('/:id/internshipTypes', express_validator_1.checkSchema(generic_val_1.ID), InternshipsCtrl.getInternshipInternshipType);
router.post('/:id/internshipTypes/:internship_type_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.InternshipTypeID)), InternshipsCtrl.linkInternshipInternshipTypes);
// Students
router.get('/:id/students', express_validator_1.checkSchema(generic_val_1.ID), InternshipsCtrl.getInternshipStudent);
router.post('/:id/students/:student_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.StudentID)), InternshipsCtrl.linkInternshipStudents);
// Files
router.get('/:id/files', express_validator_1.checkSchema(generic_val_1.ID), InternshipsCtrl.getInternshipFiles);
router.post('/:id/files/:file_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.FileID)), InternshipsCtrl.linkInternshipFiles);
exports.default = router;
//# sourceMappingURL=internships.route.js.map