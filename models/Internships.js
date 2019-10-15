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
class Internships extends Sequelize.Model {
}
Internships.init({
    id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    // Data
    subject: {
        type: new Sequelize.DataTypes.STRING(256),
        allowNull: false,
    },
    description: {
        type: new Sequelize.DataTypes.TEXT(),
        allowNull: true,
    },
    // Localisation
    country: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    city: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    postalCode: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    address: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    additional: {
        type: new Sequelize.DataTypes.STRING(),
        allowNull: true,
    },
    // State
    isLanguageCourse: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isValidated: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'internships',
    sequelize: database_1.default,
    defaultScope: {
        attributes: { exclude: ['businessId'] },
    },
});
exports.default = Internships;
//# sourceMappingURL=Internships.js.map