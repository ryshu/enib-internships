"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../configs/instances/database"));
class Students extends sequelize_1.Model {
}
Students.init({
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
    email: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    semester: {
        type: new sequelize_1.DataTypes.STRING(3),
        allowNull: false,
    },
}, {
    tableName: 'students',
    sequelize: database_1.default,
});
exports.default = Students;
//# sourceMappingURL=Students.js.map