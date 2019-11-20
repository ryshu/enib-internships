import * as Sequelize from 'sequelize';

import database from '../../configs/instances/database';

import MPS from './MentoringPropositions';
import Mentors from './Mentors';
import InternshipTypes from './InternshipTypes';
import Internships from './Internships';

import {
    IInternshipEntity,
    IMentoringPropositionEntity,
    IInternshipTypeEntity,
} from '../../declarations';

class Campaigns extends Sequelize.Model {
    public static associations: {
        propositions: Sequelize.Association<Campaigns, MPS>;
        availbleInternships: Sequelize.Association<Campaigns, Internships>;
        validatedInternships: Sequelize.Association<Campaigns, Internships>;
        mentors: Sequelize.Association<Campaigns, Mentors>;
        category: Sequelize.Association<Campaigns, InternshipTypes>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public name: string;
    public description: string;

    public semester: string;
    public maxProposition: number;

    public isPublish: boolean;

    public startAt: number;
    public endAt: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Proposition
    public getPropositions: Sequelize.HasManyGetAssociationsMixin<MPS>;
    public addProposition: Sequelize.HasManyAddAssociationMixin<MPS, MPS['id']>;
    public createProposition: Sequelize.HasManyCreateAssociationMixin<IMentoringPropositionEntity>;
    public hasProposition: Sequelize.HasManyHasAssociationMixin<MPS, MPS['id']>;
    public countPropositions: Sequelize.HasManyCountAssociationsMixin;

    // Mentor
    public getMentors: Sequelize.BelongsToManyGetAssociationsMixin<Mentors>;
    public addMentor: Sequelize.BelongsToManyAddAssociationMixin<Mentors, Mentors['id']>;
    public hasMentor: Sequelize.BelongsToManyHasAssociationMixin<Mentors, Mentors['id']>;
    public countMentors: Sequelize.BelongsToManyCountAssociationsMixin;

    // Category
    public getCategory: Sequelize.BelongsToGetAssociationMixin<InternshipTypes>;
    public setCategory: Sequelize.BelongsToSetAssociationMixin<
        InternshipTypes,
        InternshipTypes['id']
    >;
    public createCategory: Sequelize.BelongsToCreateAssociationMixin<IInternshipTypeEntity>;

    // AvailableInternships
    public getAvailableInternships: Sequelize.HasManyGetAssociationsMixin<Internships>;
    public addAvailableInternship: Sequelize.HasManyAddAssociationMixin<
        Internships,
        Internships['id']
    >;
    public createAvailableInternship: Sequelize.HasManyCreateAssociationMixin<IInternshipEntity>;
    public hasAvailableInternship: Sequelize.HasManyHasAssociationMixin<
        Internships,
        Internships['id']
    >;
    public countAvailableInternships: Sequelize.HasManyCountAssociationsMixin;

    // ValidatedInternships
    public getValidatedInternships: Sequelize.HasManyGetAssociationsMixin<Internships>;
    public addValidatedInternship: Sequelize.HasManyAddAssociationMixin<
        Internships,
        Internships['id']
    >;
    public createValidatedInternship: Sequelize.HasManyCreateAssociationMixin<IInternshipEntity>;
    public hasValidatedInternship: Sequelize.HasManyHasAssociationMixin<
        Internships,
        Internships['id']
    >;
    public countValidatedInternships: Sequelize.HasManyCountAssociationsMixin;

    public readonly propositions?: MPS[];
    public readonly availableInternships?: Internships[];
    public readonly validatedInternships?: Internships[];
    public readonly mentors?: Mentors[];
    public readonly category: InternshipTypes;
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

        semester: {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        maxProposition: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
            allowNull: true,
        },

        isPublish: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
        },

        startAt: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
        },
        endAt: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        tableName: 'campaigns',
        sequelize: database,
        defaultScope: {
            attributes: { exclude: ['categoryId'] },
        },
    },
);

export default Campaigns;
