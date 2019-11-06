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
const MentorsCtrl = __importStar(require("../controllers/mentors.ctrl"));
const generic_val_1 = require("../validators/generic.val");
const mentors_val_1 = require("../validators/mentors.val");
const router = express_1.default.Router();
// Mentors
router.get('', express_validator_1.checkSchema(mentors_val_1.MentorList), MentorsCtrl.getMentors);
router.post('', express_validator_1.checkSchema(mentors_val_1.MentorCreate), MentorsCtrl.postMentor);
router.get('/:id', express_validator_1.checkSchema(generic_val_1.ID), MentorsCtrl.getMentor);
router.put('/:id', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, mentors_val_1.MentorUpdate)), MentorsCtrl.putMentor);
router.delete('/:id', express_validator_1.checkSchema(generic_val_1.ID), MentorsCtrl.deleteMentor);
// Mentors campaigns
router.get('/:id/campaigns', express_validator_1.checkSchema(generic_val_1.ID), MentorsCtrl.getMentorCampaigns);
router.post('/:id/campaigns/:campaign_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.CampaignID)), MentorsCtrl.linkMentorCampaign);
// Mentors propositions
router.get('/:id/propositions', express_validator_1.checkSchema(generic_val_1.ID), MentorsCtrl.getMentorPropositions);
router.post('/:id/propositions/:mentoring_proposition_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.MentoringPropositionID)), MentorsCtrl.linkMentorProposition);
// Mentors internships
router.get('/:id/internships', express_validator_1.checkSchema(generic_val_1.ID), MentorsCtrl.getMentorInternships);
router.post('/:id/internships/:internship_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.InternshipID)), MentorsCtrl.linkMentorInternship);
exports.default = router;
//# sourceMappingURL=mentors.route.js.map