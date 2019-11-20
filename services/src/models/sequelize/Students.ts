import * as Sequelize from 'sequelize';

import database from '../../configs/instances/database';

import { IInternshipEntity } from '../../declarations';

import Internships from './Internships';
class Students extends Sequelize.Model {
    public static associations: {
        student: Sequelize.Association<Students, Internships>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public firstName: string;
    public lastName: string;
    public email: string;
    public semester: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Internships
    public getInternships: Sequelize.HasManyGetAssociationsMixin<Internships>;
    public addInternship: Sequelize.HasManyAddAssociationMixin<Internships, Internships['id']>;
    public createInternship: Sequelize.HasManyCreateAssociationMixin<IInternshipEntity>;
    public hasInternship: Sequelize.HasManyHasAssociationMixin<Internships, Internships['id']>;
    public countInternships: Sequelize.HasManyCountAssociationsMixin;

    public readonly internships?: Internships[];
    public internshipCount: number;
}

Students.init(
    {
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
        semester: {
            type: new Sequelize.DataTypes.STRING(3),
            allowNull: false,
        },
    },
    {
        tableName: 'students',
        sequelize: database,
    },
);

export default Students;
