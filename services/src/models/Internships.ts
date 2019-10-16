import * as Sequelize from 'sequelize';

import database from '../configs/instances/database';

import Businesses from './Businesses';

class Internships extends Sequelize.Model implements IInternshipEntity {
    public static associations: {
        business: Sequelize.Association<Internships, Businesses>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    // Data
    public subject: string;
    public description: string;

    // Localisation
    public country: string;
    public city: string;
    public postalCode: string;
    public address: string;
    public additional?: string;

    // State
    public isLanguageCourse: boolean;
    public isValidated: boolean;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getBusiness: Sequelize.BelongsToGetAssociationMixin<Businesses>;
    public setBusiness: Sequelize.BelongsToSetAssociationMixin<Businesses, Businesses['id']>;
    public createBusiness: Sequelize.BelongsToCreateAssociationMixin<IBusinessEntity>;

    public readonly business?: Businesses | Businesses['id'];
}

Internships.init(
    {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        // Data
        subject: {
            type: new Sequelize.DataTypes.STRING(256),
            allowNull: false,
        },
        description: {
            type: new Sequelize.DataTypes.TEXT(),
            allowNull: true,
        },

        // Localisation
        country: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        city: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        postalCode: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        address: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        additional: {
            type: new Sequelize.DataTypes.STRING(),
            allowNull: true,
        },

        // State
        isLanguageCourse: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isValidated: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'internships',
        sequelize: database,
        defaultScope: {
            attributes: { exclude: ['businessId'] },
        },
    },
);

export default Internships;