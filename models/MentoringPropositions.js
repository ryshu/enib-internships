"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../configs/instances/database"));
class MentoringPropositions extends sequelize_1.Model {
}
MentoringPropositions.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    comment: {
        type: new sequelize_1.DataTypes.TEXT(),
        allowNull: true,
    },
}, {
    tableName: 'mentoring-propositions',
    sequelize: database_1.default,
});
exports.default = MentoringPropositions;
//# sourceMappingURL=MentoringPropositions.js.map