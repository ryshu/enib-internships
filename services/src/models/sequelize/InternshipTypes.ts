import * as Sequelize from 'sequelize';

import database from '../../configs/instances/database';

import Internships from './Internships';
import Campaigns from './Campaigns';

import { ICampaignEntity, IInternshipEntity } from '../../declarations';

class InternshipTypes extends Sequelize.Model {
    public static associations: {
        internships: Sequelize.Association<InternshipTypes, Internships>;
        campaigns: Sequelize.Association<InternshipTypes, Campaigns>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public label: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Internships
    public getInternships: Sequelize.HasManyGetAssociationsMixin<Internships>;
    public addInternship: Sequelize.HasManyAddAssociationMixin<Internships, Internships['id']>;
    public createInternship: Sequelize.HasManyCreateAssociationMixin<IInternshipEntity>;
    public hasInternship: Sequelize.HasManyHasAssociationMixin<Internships, Internships['id']>;
    public countInternships: Sequelize.HasManyCountAssociationsMixin;

    // Campaigns
    public getCampaigns: Sequelize.HasManyGetAssociationsMixin<Campaigns>;
    public addCampaign: Sequelize.HasManyAddAssociationMixin<Campaigns, Campaigns['id']>;
    public createCampaign: Sequelize.HasManyCreateAssociationMixin<ICampaignEntity>;
    public hasCampaign: Sequelize.HasManyHasAssociationMixin<Campaigns, Campaigns['id']>;
    public countCampaigns: Sequelize.HasManyCountAssociationsMixin;

    public readonly internships?: Internships[];
    public readonly campaigns?: Campaigns[];
}

InternshipTypes.init(
    {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        label: {
            type: new Sequelize.DataTypes.TEXT(),
            allowNull: true,
        },
    },
    {
        tableName: 'internship-types',
        sequelize: database,
        timestamps: true,
        paranoid: true,
    },
);

export default InternshipTypes;
