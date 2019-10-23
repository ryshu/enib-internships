import * as Sequelize from 'sequelize';

import database from '../configs/instances/database';

import Internships from './Internships';

class InternshipTypes extends Sequelize.Model implements IInternshipTypeEntity {
    public static associations: {
        internships: Sequelize.Association<InternshipTypes, Internships>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public label: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getInternships: Sequelize.HasManyGetAssociationsMixin<Internships>;
    public addInternship: Sequelize.HasManyAddAssociationMixin<Internships, Internships['id']>;
    public createInternship: Sequelize.HasManyCreateAssociationMixin<IInternshipEntity>;
    public hasInternship: Sequelize.HasManyHasAssociationMixin<Internships, Internships['id']>;
    public countInternships: Sequelize.HasManyCountAssociationsMixin;

    public readonly internships?: Internships[];
}

InternshipTypes.init(
    {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        label: {
            type: new Sequelize.DataTypes.TEXT(),
            allowNull: true,
        },
    },
    {
        tableName: 'internship-types',
        sequelize: database,
    },
);

export default InternshipTypes;
