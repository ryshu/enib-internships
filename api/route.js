"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const businesses_route_1 = __importDefault(require("./routers/businesses.route"));
const campaigns_route_1 = __importDefault(require("./routers/campaigns.route"));
const internships_route_1 = __importDefault(require("./routers/internships.route"));
const internship_types_route_1 = __importDefault(require("./routers/internship.types.route"));
const students_route_1 = __importDefault(require("./routers/students.route"));
const files_route_1 = __importDefault(require("./routers/files.route"));
const mentoring_propositions_route_1 = __importDefault(require("./routers/mentoring.propositions.route"));
const mentors_route_1 = __importDefault(require("./routers/mentors.route"));
const route_1 = __importDefault(require("../auth/cas/route"));
const statistics_ctrl_1 = require("./controllers/statistics.ctrl");
const router = express_1.default.Router();
router.use('/businesses', businesses_route_1.default);
router.use('/campaigns', campaigns_route_1.default);
router.use('/internships', internships_route_1.default);
router.use('/internshipTypes', internship_types_route_1.default);
router.use('/students', students_route_1.default);
router.use('/mentors', mentors_route_1.default);
router.use('/files', files_route_1.default);
router.use('/mentoringPropositions', mentoring_propositions_route_1.default);
router.get('/statistics', statistics_ctrl_1.getStatistics);
router.use('/cas', route_1.default);
exports.default = router;
//# sourceMappingURL=route.js.map