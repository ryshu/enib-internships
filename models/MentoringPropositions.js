"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = __importStar(require("sequelize"));
const database_1 = __importDefault(require("../configs/instances/database"));
class MentoringPropositions extends Sequelize.Model {
}
MentoringPropositions.init({
    id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    comment: {
        type: new Sequelize.DataTypes.TEXT(),
        allowNull: true,
    },
}, {
    tableName: 'mentoring-propositions',
    sequelize: database_1.default,
    defaultScope: {
        attributes: { exclude: ['campaignId', 'mentorId', 'internshipId'] },
    },
});
exports.default = MentoringPropositions;
//# sourceMappingURL=MentoringPropositions.js.map