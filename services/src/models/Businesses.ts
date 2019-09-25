import { Model, DataTypes } from 'sequelize';

import database from '../configs/instances/database';

class Businesses extends Model implements IBusinessEntity {
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
}

Businesses.init(
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
        country: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            defaultValue: 'France',
        },
        city: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            defaultValue: 'Brest',
        },
        postalCode: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            defaultValue: '29200',
        },
        address: {
            type: new DataTypes.STRING(),
            allowNull: false,
        },
        additional: {
            type: new DataTypes.STRING(),
            allowNull: true,
        },
    },
    {
        tableName: 'businessess',
        sequelize: database,
    },
);

export default Businesses;
