"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../instances/database"));
require("../../models/Businesses");
require("../../models/Files");
require("../../models/Internships");
require("../../models/MentoringPropositions");
require("../../models/Mentors");
require("../../models/Students");
exports.default = database_1.default.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
//# sourceMappingURL=database.js.map