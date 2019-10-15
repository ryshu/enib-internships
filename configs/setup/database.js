"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../instances/database"));
const Businesses_1 = __importDefault(require("../../models/Businesses"));
const Internships_1 = __importDefault(require("../../models/Internships"));
Businesses_1.default.hasMany(Internships_1.default, { as: 'internships', foreignKey: 'businessId', sourceKey: 'id' });
Internships_1.default.belongsTo(Businesses_1.default, { as: 'business', foreignKey: 'businessId', targetKey: 'id' });
exports.default = database_1.default.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
//# sourceMappingURL=database.js.map