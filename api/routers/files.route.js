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
const FilesCtrl = __importStar(require("../controllers/files.ctrl"));
const generic_val_1 = require("../validators/generic.val");
const files_val_1 = require("../validators/files.val");
const router = express_1.default.Router();
router.get('', express_validator_1.checkSchema(files_val_1.FileList), FilesCtrl.getFiles);
router.post('', express_validator_1.checkSchema(files_val_1.FileCreate), FilesCtrl.postFile);
router.get('/:id', express_validator_1.checkSchema(generic_val_1.ID), FilesCtrl.getFile);
router.put('/:id', express_validator_1.checkSchema(Object.assign({}, generic_val_1.ID, files_val_1.FileUpdate)), FilesCtrl.putFile);
router.delete('/:id', express_validator_1.checkSchema(generic_val_1.ID), FilesCtrl.deleteFile);
exports.default = router;
//# sourceMappingURL=files.route.js.map