"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const businesses_route_1 = __importDefault(require("./routers/businesses.route"));
const internships_route_1 = __importDefault(require("./routers/internships.route"));
const students_route_1 = __importDefault(require("./routers/students.route"));
const files_route_1 = __importDefault(require("./routers/files.route"));
const mentoring_propositions_route_1 = __importDefault(require("./routers/mentoring.propositions.route"));
const route_1 = __importDefault(require("../mock/route"));
const router = express_1.default.Router();
router.use('/businesses', businesses_route_1.default);
router.use('/internships', internships_route_1.default);
router.use('/students', students_route_1.default);
router.use('/files', files_route_1.default);
router.use('/mentoringPropositions', mentoring_propositions_route_1.default);
router.use(route_1.default);
exports.default = router;
//# sourceMappingURL=route.js.map