import sequelize, { CreateOptions, FindOptions } from 'sequelize';

import Files from './sequelize/Files';
import Internships from './sequelize/Internships';

import { PaginateList } from './helpers/type';
import { paginate, PaginateOpts } from './helpers/pagination';
import { extractCount, setFindOptsArchived } from './helpers/options';

import { checkPartialFile, checkPartialInternship } from '../utils/check';

import { IFileEntity } from '../declarations';

/** @interface FileOpts Interface of all availables filters for files list */
export interface FileOpts {
    /** @property {number} internshipId Filter files by internship */
    internshipId?: number;

    /** @property {boolean} archived Show only archived files */
    archived?: boolean;
}

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
    public getFiles(
        fileOpts: FileOpts,
        pageOpts: PaginateOpts,
    ): Promise<PaginateList<IFileEntity>> {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(fileOpts);

            let max: number;
            Files.count(extractCount(opts))
                .then((rowNbr) => {
                    max = rowNbr;

                    return Files.findAll(paginate(pageOpts, opts));
                })
                .then((files: any) =>
                    resolve(
                        files.length
                            ? {
                                  page: pageOpts.page,
                                  data: files as IFileEntity[],
                                  length: files.length,
                                  max,
                              }
                            : undefined,
                    ),
                )
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
    public createFile(file: IFileEntity): Promise<IFileEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                if (file.id) {
                    const prev = await Files.findByPk(file.id);
                    if (prev) {
                        const updated = await this.updateFile(file.id, file);
                        return resolve(updated);
                    }
                }

                const created = await Files.create(file, this._buildCreateOpts(file));

                // TODO: handle socket to send create
                resolve(created.toJSON() as IFileEntity);
            } catch (error) {
                reject(error);
            }
        });
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
    public getFile(id: number, archived?: boolean): Promise<IFileEntity> {
        return new Promise((resolve, reject) => {
            const opts = { include: [{ model: Internships, as: 'internship' }] };
            Files.findByPk(id, archived ? setFindOptsArchived(opts) : opts)
                .then((val: any) => resolve(val as IFileEntity))
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
    public updateFile(id: number, next: Partial<IFileEntity>): Promise<IFileEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const file = await Files.findByPk(id);
                if (!file) {
                    // TODO: Check if file exist efore create

                    // Try to create file if all required fields are given
                    if (checkPartialFile(next)) {
                        delete next.id; // Prevent recursive call by removing id;
                        const created = await this.createFile(next);
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

                const updated = await file.save();
                // TODO: Socket emit file update
                return resolve(updated.toJSON() as IFileEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to remove file
     * @param {number} id file identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    public removeFile(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            // TODO: Socket emit file remove
            Files.findByPk(id)
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
    public linkToInternship(fileId: number, internshipId: number): Promise<IFileEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const file = await Files.findByPk(fileId);
                if (!file) {
                    return resolve();
                }
                const internship = await Internships.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }

                await file.setInternship(internship);
                return resolve(await this.getFile(file.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    private _buildFindOpts(opts: FileOpts): FindOptions {
        let tmp: sequelize.FindOptions = { where: {} };

        if (opts.internshipId !== undefined) {
            (tmp.where as any).internshipId = opts.internshipId;
        }

        if (opts.archived) {
            tmp = setFindOptsArchived(tmp);
        }

        return tmp;
    }

    private _buildCreateOpts(campaign: IFileEntity): CreateOptions {
        const opts: CreateOptions = { include: [] };

        if (
            campaign.internship &&
            checkPartialInternship(campaign.internship) &&
            campaign.internship.id !== undefined
        ) {
            opts.include.push({ association: Files.associations.internship });
        }

        if (opts.include.length === 0) {
            delete opts.include;
        }

        return opts;
    }
}

// Init Struct and export as default this model
const FileModel = new FileModelStruct();
export default FileModel;
