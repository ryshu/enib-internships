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
const Files_1 = __importDefault(require("./sequelize/Files"));
const Internships_1 = __importDefault(require("./sequelize/Internships"));
const pagination_1 = require("./helpers/pagination");
const options_1 = require("./helpers/options");
const check_1 = require("../utils/check");
/**
 * @class FileModelStruct
 *
 * API for file use in database
 */
class FileModelStruct {
    /**
     * @summary Method used to retrieve all files
     * @param {FileOpts} fileOpts files options
     * @param {PaginateOpts} pageOpts pagination options
     * @returns {Promise<PaginateList<IFileEntity>>} Resolve: Paginate files list
     * @returns {Promise<void>} Resolve: Not any files in list
     * @returns {Promise<any>} Reject: database error
     */
    getFiles(fileOpts, pageOpts) {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(fileOpts);
            let max;
            Files_1.default.count(options_1.extractCount(opts))
                .then((rowNbr) => {
                max = rowNbr;
                return Files_1.default.findAll(pagination_1.paginate(pageOpts, opts));
            })
                .then((files) => resolve(files.length
                ? {
                    page: pageOpts.page,
                    data: files,
                    length: files.length,
                    max,
                }
                : undefined))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to create a file
     * @notice If file is defined, update it instead of create
     * @notice Also create or link sub-models if given
     * @param {IFileEntity} file file data
     * @returns {Promise<IFileEntity>} Resolve: IFileEntity
     * @returns {Promise<any>} Reject: database error
     */
    createFile(file) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (file.id) {
                    const prev = yield Files_1.default.findByPk(file.id);
                    if (prev) {
                        const updated = yield this.updateFile(file.id, file);
                        return resolve(updated);
                    }
                }
                const created = yield Files_1.default.create(file, this._buildCreateOpts(file));
                // TODO: handle socket to send create
                resolve(created.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to retrieve file by identifier
     * @notice Include internships by default
     * @param {number} id file identifier
     * @param {boolean | undefined} archived If file is archived
     * @returns {Promise<IFileEntity>} Resolve: found file
     * @returns {Promise<void>} Resolve: no file found
     * @returns {Promise<any>} Reject: database error
     */
    getFile(id, archived) {
        return new Promise((resolve, reject) => {
            const opts = { include: [{ model: Internships_1.default, as: 'internship' }] };
            Files_1.default.findByPk(id, archived ? options_1.setFindOptsArchived(opts) : opts)
                .then((val) => resolve(val))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to update a file
     * @notice If not any file is found, but all update data required to create
     * a new file is available, create this new file
     * @param {number} id file identifier
     * @param {Partial<IFileEntity>} next file data to update
     * @returns {Promise<IFileEntity>} Resolve: IFileEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    updateFile(id, next) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield Files_1.default.findByPk(id);
                if (!file) {
                    // TODO: Check if file exist efore create
                    // Try to create file if all required fields are given
                    if (check_1.checkPartialFile(next)) {
                        delete next.id; // Prevent recursive call by removing id;
                        const created = yield this.createFile(next);
                        return resolve(created);
                    }
                    return resolve();
                }
                if (next.name) {
                    file.set('name', next.name);
                }
                if (next.type) {
                    file.set('type', next.type);
                }
                if (next.path) {
                    file.set('path', next.path);
                }
                // TODO: Also update internships ?
                const updated = yield file.save();
                // TODO: Socket emit file update
                return resolve(updated.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to remove file
     * @param {number} id file identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    removeFile(id) {
        return new Promise((resolve, reject) => {
            // TODO: Socket emit file remove
            Files_1.default.findByPk(id)
                .then((val) => (val ? val.destroy() : undefined))
                .then(() => resolve())
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to link file to internship
     * @param {number} fileId file identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IFileEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    linkToInternship(fileId, internshipId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield Files_1.default.findByPk(fileId);
                if (!file) {
                    return resolve();
                }
                const internship = yield Internships_1.default.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                yield file.setInternship(internship);
                return resolve(yield this.getFile(file.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    _buildFindOpts(opts) {
        let tmp = { where: {} };
        if (opts.internshipId !== undefined) {
            tmp.where.internshipId = opts.internshipId;
        }
        if (opts.archived) {
            tmp = options_1.setFindOptsArchived(tmp);
        }
        return tmp;
    }
    _buildCreateOpts(campaign) {
        const opts = { include: [] };
        if (campaign.internship &&
            check_1.checkPartialInternship(campaign.internship) &&
            campaign.internship.id !== undefined) {
            opts.include.push({ association: Files_1.default.associations.internship });
        }
        if (opts.include.length === 0) {
            delete opts.include;
        }
        return opts;
    }
}
// Init Struct and export as default this model
const FileModel = new FileModelStruct();
exports.default = FileModel;
//# sourceMappingURL=files.model.js.map