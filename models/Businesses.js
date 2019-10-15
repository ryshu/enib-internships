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
class Businesses extends Sequelize.Model {
}
Businesses.init({
    id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    country: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
        defaultValue: 'France',
    },
    city: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
        defaultValue: 'Brest',
    },
    postalCode: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
        defaultValue: '29200',
    },
    address: {
        type: new Sequelize.DataTypes.STRING(),
        allowNull: false,
    },
    additional: {
        type: new Sequelize.DataTypes.STRING(),
        allowNull: true,
    },
}, {
    tableName: 'businesses',
    sequelize: database_1.default,
});
exports.default = Businesses;
//# sourceMappingURL=Businesses.js.map