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
class Mentors extends Sequelize.Model {
}
Mentors.init({
    id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    lastName: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    role: {
        type: new Sequelize.DataTypes.STRING(40),
        allowNull: true,
        defaultValue: 'default',
    },
}, {
    tableName: 'mentors',
    sequelize: database_1.default,
    timestamps: true,
    paranoid: true,
});
exports.default = Mentors;
//# sourceMappingURL=Mentors.js.map