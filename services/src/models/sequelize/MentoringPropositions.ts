import * as Sequelize from 'sequelize';

import database from '../../configs/instances/database';

import Campaigns from './Campaigns';
import Mentors from './Mentors';
import Internships from './Internships';

import { ICampaignEntity, IInternshipEntity, IMentorEntity } from '../../declarations';

class MentoringPropositions extends Sequelize.Model {
    public static associations: {
        mentor: Sequelize.Association<MentoringPropositions, Mentors>;
        campaign: Sequelize.Association<MentoringPropositions, Campaigns>;
        internship: Sequelize.Association<MentoringPropositions, Internships>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public comment: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Campaign
    public getCampaign: Sequelize.BelongsToGetAssociationMixin<Campaigns>;
    public setCampaign: Sequelize.BelongsToSetAssociationMixin<Campaigns, Campaigns['id']>;
    public createCampaign: Sequelize.BelongsToCreateAssociationMixin<ICampaignEntity>;

    // Mentors
    public getMentor: Sequelize.BelongsToGetAssociationMixin<Mentors>;
    public setMentor: Sequelize.BelongsToSetAssociationMixin<Mentors, Mentors['id']>;
    public createMentor: Sequelize.BelongsToCreateAssociationMixin<IMentorEntity>;

    // Internships
    public getInternship: Sequelize.BelongsToGetAssociationMixin<Internships>;
    public setInternship: Sequelize.BelongsToSetAssociationMixin<Internships, Internships['id']>;
    public createInternship: Sequelize.BelongsToCreateAssociationMixin<IInternshipEntity>;

    public readonly campaign?: Campaigns | Campaigns['id'];
    public readonly mentor?: Mentors | Mentors['id'];
    public readonly internship?: Internships | Internships['id'];
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
        timestamps: true,
        paranoid: true,
        defaultScope: {
            attributes: { exclude: ['campaignId', 'mentorId', 'internshipId'] },
        },
    },
);

export default MentoringPropositions;
