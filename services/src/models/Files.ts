import { Model, DataTypes } from 'sequelize';

import database from '../configs/instances/database';

class Files extends Model implements IFileEntity {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public name: string;
    public size: number;
    public type: string;
    public path: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Files.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        type: {
            type: new DataTypes.STRING(20),
            allowNull: false,
        },
        path: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: 'files',
        sequelize: database,
    },
);

export default Files;
