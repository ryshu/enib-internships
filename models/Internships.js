"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../configs/instances/database"));
class Internships extends sequelize_1.Model {
}
Internships.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    // Data
    subject: {
        type: new sequelize_1.DataTypes.STRING(256),
        allowNull: false,
    },
    description: {
        type: new sequelize_1.DataTypes.TEXT(),
        allowNull: true,
    },
    // Localisation
    country: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    city: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    postalCode: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    address: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    additional: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: true,
    },
    // State
    isLanguageCourse: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isValidated: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'internships',
    sequelize: database_1.default,
});
exports.default = Internships;
//# sourceMappingURL=Internships.js.map