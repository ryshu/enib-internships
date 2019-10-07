"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../configs/instances/database"));
class Mentors extends sequelize_1.Model {
}
Mentors.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    lastName: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    emailName: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
}, {
    tableName: 'mentors',
    sequelize: database_1.default,
});
exports.default = Mentors;
//# sourceMappingURL=Mentors.js.map