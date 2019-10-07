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
const BusinessesCtrl = __importStar(require("../controllers/businesses.ctrl"));
const generic_val_1 = require("../validators/generic.val");
const businesses_val_1 = require("../validators/businesses.val");
const router = express_1.default.Router();
router.get('', express_validator_1.checkSchema(businesses_val_1.BusinessesList), BusinessesCtrl.getBusinesses);
router.post('', express_validator_1.checkSchema(businesses_val_1.BusinessCreate), BusinessesCtrl.postBusiness);
router.get('/:id', express_validator_1.checkSchema(generic_val_1.ID), BusinessesCtrl.getBusiness);
router.put('/:id', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, businesses_val_1.BusinessUpdate)), BusinessesCtrl.putBusiness);
router.delete('/:id', express_validator_1.checkSchema(generic_val_1.ID), BusinessesCtrl.deleteBusiness);
exports.default = router;
//# sourceMappingURL=businesses.route.js.map