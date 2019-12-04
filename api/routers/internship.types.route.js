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
const InternshipTypesCtrl = __importStar(require("../controllers/internship.types.ctrl"));
const generic_val_1 = require("../validators/generic.val");
const internshipTypes_val_1 = require("../validators/internshipTypes.val");
const internships_val_1 = require("../validators/internships.val");
const router = express_1.default.Router();
// Internships types
router.get('', express_validator_1.checkSchema(internshipTypes_val_1.InternshipTypeList), InternshipTypesCtrl.getInternshipTypes);
router.post('', express_validator_1.checkSchema(internshipTypes_val_1.InternshipTypeCreate), InternshipTypesCtrl.postInternshipType);
router.get('/:id', express_validator_1.checkSchema(generic_val_1.ID), InternshipTypesCtrl.getInternshipType);
router.put('/:id', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, internshipTypes_val_1.InternshipTypeUpdate)), InternshipTypesCtrl.putInternshipType);
router.delete('/:id', express_validator_1.checkSchema(generic_val_1.ID), InternshipTypesCtrl.deleteInternshipType);
// Internships types link to internships
router.get('/:id/internships', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, internships_val_1.InternshipsList)), InternshipTypesCtrl.getInternshipTypeInternships);
router.post('/:id/internships/:internship_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.InternshipID)), InternshipTypesCtrl.linkInternshipTypeInternship);
// Internships types link to campaigns
router.get('/:id/campaigns', express_validator_1.checkSchema(generic_val_1.ID), InternshipTypesCtrl.getInternshipTypeCampaigns);
router.post('/:id/campaigns/:campaign_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.CampaignID)), InternshipTypesCtrl.linkInternshipTypeCampaign);
exports.default = router;
//# sourceMappingURL=internship.types.route.js.map