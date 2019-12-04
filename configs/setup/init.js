"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const InternshipTypes_1 = __importDefault(require("../../models/sequelize/InternshipTypes"));
const logger_1 = __importDefault(require("../../utils/logger"));
const categories_1 = require("../data/categories");
const Mentors_1 = __importDefault(require("../../models/sequelize/Mentors"));
const admin_1 = require("../data/admin");
const statistics_1 = require("./statistics");
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Setup admin
            const mentors = yield Mentors_1.default.findAll({
                where: {
                    email: { [Sequelize.Op.in]: admin_1.adminsEmail },
                },
            });
            const promises = [];
            for (const admin of admin_1.admins) {
                const found = mentors.findIndex((m) => m.email === admin.email);
                if (found === -1) {
                    // Create admin
                    promises.push(Mentors_1.default.create(admin));
                    logger_1.default.info(`ADMINS - Inject admin '${admin.email}'`);
                }
                else {
                    // Check if admin definition is OK
                    const mentor = mentors[found];
                    if (mentor.role !== 'admin') {
                        mentor.set('role', 'admin');
                        promises.push(mentor.save());
                        logger_1.default.info(`ADMINS - Update admin '${admin.email}'`);
                    }
                }
            }
            // Setup categories
            const categories = yield InternshipTypes_1.default.findAll();
            if (!categories || !Array.isArray(categories) || !categories.length) {
                // If not any categories, create all default categories
                for (const label of categories_1.defaultCategories) {
                    promises.push(InternshipTypes_1.default.create({ label }));
                    logger_1.default.info(`CATEGORIES - Inject '${label}'`);
                }
            }
            yield Promise.all(promises);
            yield statistics_1.setupStatistics();
        }
        catch (error) {
            // Log error and exit
            logger_1.default.error(error);
            process.exit(1);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=init.js.map