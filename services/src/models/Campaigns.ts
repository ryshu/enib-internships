import * as Sequelize from 'sequelize';

import database from '../configs/instances/database';

import MPS from './MentoringPropositions';
import Mentors from './Mentors';

class Campaigns extends Sequelize.Model implements ICampaignEntity {
    public static associations: {
        propositions: Sequelize.Association<Campaigns, MPS>;
        mentors: Sequelize.Association<Campaigns, Mentors>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public name: string;
    public description: string;
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

    public getMentors: Sequelize.BelongsToManyGetAssociationsMixin<Mentors>;
    public addMentor: Sequelize.BelongsToManyAddAssociationMixin<Mentors, Mentors['id']>;
    public hasMentor: Sequelize.BelongsToManyHasAssociationMixin<Mentors, Mentors['id']>;
    public countMentors: Sequelize.BelongsToManyCountAssociationsMixin;

    public readonly propositions?: MPS[];
    public readonly mentors?: Mentors[];
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
        description: {
            type: new Sequelize.DataTypes.TEXT(),
            allowNull: false,
        },
        startAt: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: null,
        },
        endAt: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: null,
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
