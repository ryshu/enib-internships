import { Model, DataTypes } from 'sequelize';

import database from '../configs/instances/database';

class Mentors extends Model implements IMentorEntity {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public firstName: string;
    public lastName: string;
    public email: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Mentors.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        lastName: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: 'mentors',
        sequelize: database,
    },
);

export default Mentors;
