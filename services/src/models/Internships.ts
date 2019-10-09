import { Model, DataTypes } from 'sequelize';

import database from '../configs/instances/database';

class Internships extends Model implements IInternshipEntity {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    // Data
    public subject: string;
    public description: string;

    // Localisation
    public country: string;
    public city: string;
    public address: string;
    public additional?: string;

    // State
    public isLanguageCourse: boolean;
    public isValidated: boolean;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Internships.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        // Data
        subject: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: new DataTypes.TEXT(),
            allowNull: true,
        },

        // Localisation
        country: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        city: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        address: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        additional: {
            type: new DataTypes.STRING(),
            allowNull: true,
        },

        // State
        isLanguageCourse: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isValidated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'internships',
        sequelize: database,
    },
);

export default Internships;
