import { CreateOptions } from 'sequelize';

import Students from './sequelize/Students';
import Internships from './sequelize/Internships';

import { IStudentEntity } from '../declarations';

import { checkPartialStudent, checkPartialInternship } from '../utils/check';
import { PaginateList } from './helpers/type';
import { PaginateOpts, paginate } from './helpers/pagination';

/**
 * @interface StudentModelStruct API to handle students in database
 * @class
 */
class StudentModelStruct {
    /**
     * @summary Method used to retrieve students
     * @param {PaginateOpts} pageOpts pagination options
     * @returns {Promise<PaginateList<IStudentEntity>>} Resolve: Paginated students
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    public getStudents(pageOpts: PaginateOpts): Promise<PaginateList<IStudentEntity>> {
        return new Promise((resolve, reject) => {
            let max: number;
            Students.count()
                .then((rowNbr) => {
                    max = rowNbr;
                    return Students.findAll(paginate(pageOpts));
                })
                .then(async (students: any) =>
                    students.length
                        ? resolve({
                              page: pageOpts.page,
                              data: students as IStudentEntity[],
                              length: students.length,
                              max,
                          })
                        : resolve(),
                )
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
    public createStudent(student: IStudentEntity): Promise<IStudentEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                if (student.id) {
                    const prev = await Students.findByPk(student.id);
                    if (prev) {
                        const updated = await this.updateStudent(student.id, student);
                        if (updated) {
                            return resolve(updated);
                        }
                    }
                }

                const created = await Students.create(student, this._buildCreateOpts(student));
                // TODO: emit creation on websocket

                return resolve(created.toJSON() as IStudentEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to get a student by his identifier
     * @param {number} id student identifier
     * @returns {Promise<IStudentEntity>} Resolve: student
     * @returns {Promise<void>} Resolve: not found
     * @returns {Promise<any>} Reject: database error
     */
    public getStudent(id: number): Promise<IStudentEntity> {
        return new Promise((resolve, reject) => {
            Students.findByPk(id, {
                include: [{ model: Internships, as: 'internships' }],
            })
                .then((student) =>
                    resolve(student ? (student.toJSON() as IStudentEntity) : undefined),
                )
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
    public updateStudent(id: number, next: Partial<IStudentEntity>): Promise<IStudentEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const student = await Students.findByPk(id);
                if (!student) {
                    if (checkPartialStudent(next)) {
                        delete next.id; // remove to prevent recursive calls
                        const created = await this.createStudent(next);
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
                const updated = await student.save();
                // TODO: emit updated student on websocket

                return resolve(updated.toJSON() as IStudentEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to remove an student
     * @param {number} id student identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    public removeStudent(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const student = await Students.findByPk(id);
                if (student) {
                    await student.destroy();
                }

                // TODO: emit file destruction
                // TODO: add option to remove linked internships

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between student and his internship
     * @param {number} studentId student identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IStudentEntity>} Resolve: IStudentEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToInternship(studentId: number, internshipId: number): Promise<IStudentEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const student = await Students.findByPk(studentId);
                if (!student) {
                    return resolve();
                }
                const internship = await Internships.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }

                await student.addInternship(internship);
                // TODO: Emit update on socket

                return resolve(await this.getStudent(student.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    private _buildCreateOpts(student: IStudentEntity): CreateOptions {
        const opts: CreateOptions = { include: [] };

        if (student.internships) {
            let set = true;
            for (const internship of student.internships) {
                if (!checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Students.associations.internships });
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
export default StudentModel;
