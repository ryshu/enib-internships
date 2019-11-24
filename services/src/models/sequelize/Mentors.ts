import * as Sequelize from 'sequelize';

import database from '../../configs/instances/database';
import Campaigns from './Campaigns';
import MPs from './MentoringPropositions';
import Internships from './Internships';

import { IInternshipEntity, IMentoringPropositionEntity } from '../../declarations';

class Mentors extends Sequelize.Model {
    public static associations: {
        propositions: Sequelize.Association<Mentors, MPs>;
        internships: Sequelize.Association<Mentors, Internships>;
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

    // Propositions
    public getPropositions: Sequelize.HasManyGetAssociationsMixin<MPs>;
    public addProposition: Sequelize.HasManyAddAssociationMixin<MPs, MPs['id']>;
    public createProposition: Sequelize.HasManyCreateAssociationMixin<IMentoringPropositionEntity>;
    public hasProposition: Sequelize.HasManyHasAssociationMixin<MPs, MPs['id']>;
    public countPropositions: Sequelize.HasManyCountAssociationsMixin;

    // Internships
    public getInternships: Sequelize.HasManyGetAssociationsMixin<Internships>;
    public addInternship: Sequelize.HasManyAddAssociationMixin<Internships, Internships['id']>;
    public createInternship: Sequelize.HasManyCreateAssociationMixin<IInternshipEntity>;
    public hasInternship: Sequelize.HasManyHasAssociationMixin<Internships, Internships['id']>;
    public countInternships: Sequelize.HasManyCountAssociationsMixin;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly campaigns?: Campaigns[];
    public readonly internships?: Internships[];
    public readonly propositions?: MPs[];
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
