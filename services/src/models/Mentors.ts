import * as Sequelize from 'sequelize';

import database from '../configs/instances/database';
import Campaigns from './Campaigns';

class Mentors extends Sequelize.Model implements IMentorEntity {
    public static associations: {
        campaigns: Sequelize.Association<Mentors, Campaigns>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public firstName: string;
    public lastName: string;
    public email: string;
    public role: 'default' | 'admin';

    // Campaigns
    public getCampaigns: Sequelize.BelongsToManyGetAssociationsMixin<Campaigns>;
    public addCampaign: Sequelize.BelongsToManyAddAssociationMixin<Campaigns, Campaigns['id']>;
    public hasCampaign: Sequelize.BelongsToManyHasAssociationMixin<Campaigns, Campaigns['id']>;
    public countCampaigns: Sequelize.BelongsToManyCountAssociationsMixin;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly campaigns?: Campaigns[];
}

Mentors.init(
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
        role: {
            type: new Sequelize.DataTypes.STRING(40),
            allowNull: true,
            defaultValue: 'default',
        },
    },
    {
        tableName: 'mentors',
        sequelize: database,
    },
);

export default Mentors;
