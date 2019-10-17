import * as Sequelize from 'sequelize';

import database from '../configs/instances/database';

import Campaigns from './Campaigns';

class MentoringPropositions extends Sequelize.Model implements IMentoringPropositionEntity {
    public static associations: {
        campaign: Sequelize.Association<MentoringPropositions, Campaigns>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public comment: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getCampaign: Sequelize.BelongsToGetAssociationMixin<Campaigns>;
    public setCampaign: Sequelize.BelongsToSetAssociationMixin<Campaigns, Campaigns['id']>;
    public createCampaign: Sequelize.BelongsToCreateAssociationMixin<ICampaignEntity>;

    public readonly campaign?: Campaigns | Campaigns['id'];
}

MentoringPropositions.init(
    {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        comment: {
            type: new Sequelize.DataTypes.TEXT(),
            allowNull: true,
        },
    },
    {
        tableName: 'mentoring-propositions',
        sequelize: database,
        defaultScope: {
            attributes: { exclude: ['campaignId'] },
        },
    },
);

export default MentoringPropositions;
