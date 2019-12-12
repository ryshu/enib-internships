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
const sequelize_1 = __importDefault(require("sequelize"));
const Students_1 = __importDefault(require("./sequelize/Students"));
const Internships_1 = __importDefault(require("./sequelize/Internships"));
const check_1 = require("../utils/check");
const pagination_1 = require("./helpers/pagination");
const options_1 = require("./helpers/options");
const processor_1 = require("./helpers/processor");
const singleton_1 = __importDefault(require("../statistics/singleton"));
/**
 * @interface StudentModelStruct API to handle students in database
 * @class
 */
class StudentModelStruct {
    /**
     * @summary Method used to retrieve students
     * @param {StudentOpts} studentOpts students find options
     * @param {PaginateOpts} pageOpts pagination options
     * @returns {Promise<PaginateList<IStudentEntity>>} Resolve: Paginated students
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    getStudents(studentOpts, pageOpts) {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(studentOpts);
            let max;
            Students_1.default.count(options_1.extractCount(opts))
                .then((rowNbr) => {
                max = rowNbr;
                return Students_1.default.findAll(pagination_1.paginate(pageOpts, opts));
            })
                .then((students) => __awaiter(this, void 0, void 0, function* () {
                return students.length
                    ? resolve({
                        page: pageOpts.page,
                        data: students,
                        length: students.length,
                        max,
                    })
                    : resolve();
            }))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to create a new student
     * @notice If student is defined, update it instead of create
     * @notice Also create or link sub-models if given
     * @param {IStudentEntity} student student data
     * @returns {Promise<IStudentEntity>} Resolve: IStudentEntity
     * @returns {Promise<any>} Reject: database error
     */
    createStudent(student) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (student.id) {
                    const prev = yield Students_1.default.findByPk(student.id);
                    if (prev) {
                        const updated = yield this.updateStudent(student.id, student);
                        if (updated) {
                            return resolve(updated);
                        }
                    }
                }
                // TODO: If create also create sub-entities, manage their creation in stats and websocket
                student.fullName = processor_1.buildName(student.firstName, student.lastName);
                const created = yield Students_1.default.create(student, this._buildCreateOpts(student));
                singleton_1.default.addStudent();
                // TODO: emit creation on websocket
                return resolve(created.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to get a student by his identifier
     * @param {number} id student identifier
     * @param {boolean | undefined} archived is archived
     * @returns {Promise<IStudentEntity>} Resolve: student
     * @returns {Promise<void>} Resolve: not found
     * @returns {Promise<any>} Reject: database error
     */
    getStudent(id, archived) {
        return new Promise((resolve, reject) => {
            Students_1.default.findByPk(id, {
                include: [{ model: Internships_1.default, as: 'internships', paranoid: !archived }],
                paranoid: !archived,
            })
                .then((student) => resolve(student ? student.toJSON() : undefined))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to update an student
     * @notice If not any student is found, but all update data required to create
     * a new student is available, create this new student
     * @param {number} id student identifier
     * @param {Partial<IStudentEntity>} next student data to update
     * @returns {Promise<IStudentEntity>} Resolve: IStudentEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    updateStudent(id, next) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield Students_1.default.findByPk(id);
                if (!student) {
                    if (check_1.checkPartialStudent(next)) {
                        delete next.id; // remove to prevent recursive calls
                        const created = yield this.createStudent(next);
                        return resolve(created);
                    }
                    return resolve();
                }
                if (next.firstName) {
                    student.set('firstName', next.firstName);
                }
                if (next.lastName) {
                    student.set('lastName', next.lastName);
                }
                if (next.email) {
                    student.set('email', next.email);
                }
                student.set('fullName', processor_1.buildName(student.firstName, student.lastName));
                const updated = yield student.save();
                // TODO: emit updated student on websocket
                return resolve(updated.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to remove an student
     * @param {number} id student identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    removeStudent(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield Students_1.default.findByPk(id);
                if (student) {
                    yield student.destroy();
                    singleton_1.default.removeStudent();
                }
                // TODO: emit internship destruction
                // TODO: add option to remove linked internships
                resolve();
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between student and his internship
     * @param {number} studentId student identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IStudentEntity>} Resolve: IStudentEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToInternship(studentId, internshipId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield Students_1.default.findByPk(studentId);
                if (!student) {
                    return resolve();
                }
                const internship = yield Internships_1.default.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                yield student.addInternship(internship);
                // TODO: Emit update on socket
                return resolve(yield this.getStudent(student.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    _buildFindOpts(opts) {
        const tmp = { where: {} };
        if (opts.name) {
            tmp.where.fullName = { [sequelize_1.default.Op.substring]: opts.name };
        }
        if (opts.archived) {
            tmp.paranoid = false;
        }
        return tmp;
    }
    _buildCreateOpts(student) {
        const opts = { include: [] };
        if (student.internships) {
            let set = true;
            for (const internship of student.internships) {
                if (!check_1.checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Students_1.default.associations.internships });
            }
        }
        if (opts.include.length === 0) {
            delete opts.include;
        }
        return opts;
    }
}
// Init Struct and export as default this model
const StudentModel = new StudentModelStruct();
exports.default = StudentModel;
//# sourceMappingURL=student.model.js.map