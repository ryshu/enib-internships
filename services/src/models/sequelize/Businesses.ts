import * as Sequelize from 'sequelize';

import database from '../../configs/instances/database';

import Internships from './Internships';

import { IInternshipEntity } from '../../declarations';

class Businesses extends Sequelize.Model {
    public static associations: {
        internships: Sequelize.Association<Businesses, Internships>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public name: string;
    public country: string;
    public city: string;
    public postalCode: string;
    public address: string;
    public additional: string;

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
}

Businesses.init(
    {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        country: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
            defaultValue: 'France',
        },
        city: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
            defaultValue: 'Brest',
        },
        postalCode: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
            defaultValue: '29200',
        },
        address: {
            type: new Sequelize.DataTypes.STRING(),
            allowNull: false,
        },
        additional: {
            type: new Sequelize.DataTypes.STRING(),
            allowNull: true,
        },
    },
    {
        tableName: 'businesses',
        sequelize: database,
        timestamps: true,
        paranoid: true,
    },
);

export default Businesses;
