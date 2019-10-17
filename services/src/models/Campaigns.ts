import * as Sequelize from 'sequelize';

import database from '../configs/instances/database';

import MPS from './MentoringPropositions';

class Campaigns extends Sequelize.Model implements ICampaignEntity {
    public static associations: {
        propositions: Sequelize.Association<Campaigns, MPS>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public name: string;
    public startAt: number;
    public endAt: number;
    public semester: string;
    public maxProposition: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getPropositions: Sequelize.HasManyGetAssociationsMixin<MPS>;
    public addProposition: Sequelize.HasManyAddAssociationMixin<MPS, MPS['id']>;
    public createProposition: Sequelize.HasManyCreateAssociationMixin<IMentoringPropositionEntity>;
    public hasProposition: Sequelize.HasManyHasAssociationMixin<MPS, MPS['id']>;
    public countPropositions: Sequelize.HasManyCountAssociationsMixin;

    public readonly propositions?: MPS[];
}

Campaigns.init(
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
        startAt: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        endAt: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        semester: {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        maxProposition: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
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
