import * as Sequelize from 'sequelize';

import database from '../configs/instances/database';

import MPS from './MentoringPropositions';
import Internships from './Internships';

class Campaigns extends Sequelize.Model implements ICampaignEntity {
    public static associations: {
        propositions: Sequelize.Association<Campaigns, MPS>;
        availbleInternships: Sequelize.Association<Campaigns, Internships>;
        validatedInternships: Sequelize.Association<Campaigns, Internships>;
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

    // AvailableInternships
    public getAvailableInternships: Sequelize.HasManyGetAssociationsMixin<Internships>;
    public addAvailableInternship: Sequelize.HasManyAddAssociationMixin<Internships, Internships['id']>;
    public createAvailableInternship: Sequelize.HasManyCreateAssociationMixin<IInternshipEntity>;
    public hasAvailableInternship: Sequelize.HasManyHasAssociationMixin<Internships, Internships['id']>;
    public countAvailableInternships: Sequelize.HasManyCountAssociationsMixin;

    // ValidatedInternships
    public getValidatedInternships: Sequelize.HasManyGetAssociationsMixin<Internships>;
    public addValidatedInternship: Sequelize.HasManyAddAssociationMixin<Internships, Internships['id']>;
    public createValidatedInternship: Sequelize.HasManyCreateAssociationMixin<IInternshipEntity>;
    public hasValidatedInternship: Sequelize.HasManyHasAssociationMixin<Internships, Internships['id']>;
    public countValidatedInternships: Sequelize.HasManyCountAssociationsMixin;

    public readonly propositions?: MPS[];
    public readonly availableInternships?: Internships[];
    public readonly validatedInternships?: Internships[];
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
            type: new Sequelize.DataTypes.STRING(),
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
