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
const database_1 = __importDefault(require("../../configs/instances/database"));
class Campaigns extends Sequelize.Model {
}
Campaigns.init({
    id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    description: {
        type: new Sequelize.DataTypes.TEXT(),
        allowNull: false,
    },
    semester: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    maxProposition: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: true,
    },
    isPublish: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    startAt: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
    },
    endAt: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: 'campaigns',
    sequelize: database_1.default,
    timestamps: true,
    paranoid: true,
    defaultScope: {
        attributes: { exclude: ['categoryId'] },
    },
});
exports.default = Campaigns;
//# sourceMappingURL=Campaigns.js.map