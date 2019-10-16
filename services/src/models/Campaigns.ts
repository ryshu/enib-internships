import { Model, DataTypes } from 'sequelize';

import database from '../configs/instances/database';

class Campaigns extends Model implements ICampaignEntity {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public name: string;
    public startAt: number;
    public endAt: number;
    public semester: string;
    public maxProposition: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Campaigns.init(
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
        startAt: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        endAt: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        semester: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        maxProposition: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
            allowNull: true,
        },
    },
    {
        tableName: 'campaigns',
        sequelize: database,
    },
);

export default Campaigns;
