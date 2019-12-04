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
const CampaignsCtrl = __importStar(require("../controllers/campaigns.ctrl"));
const statistics_ctrl_1 = require("../controllers/statistics.ctrl");
const generic_val_1 = require("../validators/generic.val");
const campaigns_val_1 = require("../validators/campaigns.val");
const internships_val_1 = require("../validators/internships.val");
const router = express_1.default.Router();
// Campaigns
router.get('', express_validator_1.checkSchema(campaigns_val_1.CampaignList), CampaignsCtrl.getCampaigns);
router.post('', express_validator_1.checkSchema(campaigns_val_1.CampaignCreate), CampaignsCtrl.postCampaign);
router.get('/:id', express_validator_1.checkSchema(generic_val_1.ID), CampaignsCtrl.getCampaign);
router.put('/:id', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, campaigns_val_1.CampaignUpdate)), CampaignsCtrl.putCampaign);
router.delete('/:id', express_validator_1.checkSchema(generic_val_1.ID), CampaignsCtrl.deleteCampaign);
// Campaigns MentoringPropositions
router.get('/:id/mentoringPropositions', express_validator_1.checkSchema(generic_val_1.ID), CampaignsCtrl.getCampaignMentoringPropositions);
router.post('/:id/mentoringPropositions/:mentoring_proposition_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.MentoringPropositionID)), CampaignsCtrl.linkCampaignMentoringPropositions);
// Campaigns Validated internships
router.get('/:id/validatedInternships', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, internships_val_1.InternshipsList)), CampaignsCtrl.getValidatedCampaignInternships);
router.post('/:id/validatedInternships/:internship_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.InternshipID)), CampaignsCtrl.linkValidatedCampaignInternships);
// Campaigns Availables Internships
router.get('/:id/availableInternships', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, internships_val_1.InternshipsList)), CampaignsCtrl.getAvailableCampaignInternships);
router.post('/:id/availableInternships/:internship_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.InternshipID)), CampaignsCtrl.linkAvailableCampaignInternships);
// Campaigns all internships
router.get('/:id/internships', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, internships_val_1.InternshipsList)), CampaignsCtrl.getCampaignInternships);
// Campaigns Mentors
router.get('/:id/mentors', express_validator_1.checkSchema(generic_val_1.ID), CampaignsCtrl.getCampaignMentors);
router.post('/:id/mentors/:mentor_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.MentorID)), CampaignsCtrl.linkCampaignMentor);
// Campaigns internship types
router.get('/:id/internshipTypes', express_validator_1.checkSchema(generic_val_1.ID), CampaignsCtrl.getCampaignInternshipType);
router.post('/:id/internshipTypes/:internship_type_id/link', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, generic_val_1.InternshipTypeID)), CampaignsCtrl.linkCampaignInternshipType);
router.get('/:id/statistics', express_validator_1.checkSchema(generic_val_1.ID), statistics_ctrl_1.getCampaignStatistics);
exports.default = router;
//# sourceMappingURL=campaigns.route.js.map