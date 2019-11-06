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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const logger_1 = __importDefault(require("../../utils/logger"));
const Mentors_1 = __importDefault(require("../../models/Mentors"));
const Students_1 = __importDefault(require("../../models/Students"));
const admin_1 = require("../../configs/data/admin");
/**
 * @summary Method used to handle cas connection and setup user info
 * @param {Request} req Express request
 * @throws {Error} If no session found `No session found in given request`
 */
function handleConnection(req) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if any session is defined
        if (req.session && req.session.cas_user) {
            // Check if cas user is a student and get his email
            // Check also if username isn't included in admin list (case when user is admin)
            const student = utils_1.isStudent(req.session.cas_user) && !admin_1.adminsCasUsername.includes(req.session.cas_user);
            const email = utils_1.getEmail(req.session.cas_user);
            // Try to get our user in database
            const user = student
                ? yield Students_1.default.findOne({ where: { email } })
                : yield Mentors_1.default.findOne({ where: { email } });
            if (user) {
                // This user is in database, copy his info into session
                req.session.info = user;
                if (student) {
                    // Set student roles, avoid to store role in database
                    req.session.info.role = 'student';
                }
                return;
            }
            // Else, we need to register this user, it's his first connection
            if (student) {
                const newUser = Object.assign(Object.assign({}, utils_1.guessStudentFullName(req.session.cas_user)), { email, semester: 'S1' });
                // Register our new student and set his data in session info
                req.session.info = yield Students_1.default.create(newUser);
            }
            else {
                const newUser = Object.assign(Object.assign({}, utils_1.guessMentorFullName(req.session.cas_user)), { email, role: 'default' });
                // Register our new mentor and set his data in session info
                req.session.info = yield Mentors_1.default.create(newUser);
            }
            logger_1.default.info(`Inject "${req.session.cas_user}" into database after his first connection`);
            return;
        }
        throw new Error('No session found in given request');
    });
}
exports.handleConnection = handleConnection;
//# sourceMappingURL=handle.js.map