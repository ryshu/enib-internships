"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../configs/instances/database"));
class Businesses extends sequelize_1.Model {
}
Businesses.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    country: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        defaultValue: 'France',
    },
    city: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        defaultValue: 'Brest',
    },
    postalCode: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        defaultValue: '29200',
    },
    address: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: false,
    },
    additional: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: true,
    },
}, {
    tableName: 'businesses',
    sequelize: database_1.default,
});
exports.default = Businesses;
//# sourceMappingURL=Businesses.js.map