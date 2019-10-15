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
const PropositionsCtrl = __importStar(require("../controllers/mentoring.propositions.ctrl"));
const generic_val_1 = require("../validators/generic.val");
const mentoringPropositions_val_1 = require("../validators/mentoringPropositions.val");
const router = express_1.default.Router();
router.get('', express_validator_1.checkSchema(mentoringPropositions_val_1.MentoringPropositionsList), PropositionsCtrl.getMentoringPropositions);
router.post('', express_validator_1.checkSchema(mentoringPropositions_val_1.MentoringPropositionCreate), PropositionsCtrl.postMentoringProposition);
router.get('/:id', express_validator_1.checkSchema(generic_val_1.ID), PropositionsCtrl.getMentoringProposition);
router.put('/:id', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, mentoringPropositions_val_1.MentoringPropositionUpdate)), PropositionsCtrl.putMentoringProposition);
router.delete('/:id', express_validator_1.checkSchema(generic_val_1.ID), PropositionsCtrl.deleteMentoringProposition);
exports.default = router;
//# sourceMappingURL=mentoring.propositions.route.js.map