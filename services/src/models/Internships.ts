import * as Sequelize from 'sequelize';

import database from '../configs/instances/database';

import Files from './Files';
import Businesses from './Businesses';
import InternshipTypes from './InternshipTypes';
import Students from './Students';
import Mentors from './Mentors';
import MPs from './MentoringPropositions';
import Campaigns from './Campaigns';

class Internships extends Sequelize.Model implements IInternshipEntity {
    public static associations: {
        category: Sequelize.Association<Internships, InternshipTypes>;
        business: Sequelize.Association<Internships, Businesses>;
        student: Sequelize.Association<Internships, Students>;
        files: Sequelize.Association<Internships, Files>;
        validatedCampaign: Sequelize.Association<Internships, Campaigns>;
        availableCampaign: Sequelize.Association<Internships, Campaigns>;
        mentor: Sequelize.Association<Internships, Mentors>;
        propositions: Sequelize.Association<Internships, MPs>;
    };

    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    // Data
    public subject: string;
    public description: string;

    // Localisation
    public country: string;
    public city: string;
    public postalCode: string;
    public address: string;
    public additional?: string;

    // State
    public isInternshipAbroad: boolean;
    public isValidated: boolean;

    // Date
    public startAt: number;
    public endAt: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Business
    public getBusiness: Sequelize.BelongsToGetAssociationMixin<Businesses>;
    public setBusiness: Sequelize.BelongsToSetAssociationMixin<Businesses, Businesses['id']>;
    public createBusiness: Sequelize.BelongsToCreateAssociationMixin<IBusinessEntity>;

    public getCategory: Sequelize.BelongsToGetAssociationMixin<InternshipTypes>;
    public setCategory: Sequelize.BelongsToSetAssociationMixin<
        InternshipTypes,
        InternshipTypes['id']
    >;
    public createCategory: Sequelize.BelongsToCreateAssociationMixin<IInternshipTypeEntity>;

    // Students
    public getStudent: Sequelize.BelongsToGetAssociationMixin<Students>;
    public setStudent: Sequelize.BelongsToSetAssociationMixin<Students, Students['id']>;
    public createStudent: Sequelize.BelongsToCreateAssociationMixin<IStudentEntity>;

    // AvailableCampaigns
    public getAvailableCampaign: Sequelize.BelongsToGetAssociationMixin<Campaigns>;
    public setAvailableCampaign: Sequelize.BelongsToSetAssociationMixin<Campaigns, Campaigns['id']>;
    public createAvailableCampaign: Sequelize.BelongsToCreateAssociationMixin<ICampaignEntity>;

    // ValidatedCampaigns
    public getValidatedCampaign: Sequelize.BelongsToGetAssociationMixin<Campaigns>;
    public setValidatedCampaign: Sequelize.BelongsToSetAssociationMixin<Campaigns, Campaigns['id']>;
    public createValidatedCampaign: Sequelize.BelongsToCreateAssociationMixin<ICampaignEntity>;

    // Files
    public getFiles: Sequelize.HasManyGetAssociationsMixin<Files>;
    public addFile: Sequelize.HasManyAddAssociationMixin<Files, Files['id']>;
    public createFile: Sequelize.HasManyCreateAssociationMixin<IFileEntity>;
    public hasFile: Sequelize.HasManyHasAssociationMixin<Files, Files['id']>;

    // Mentors
    public getMentor: Sequelize.BelongsToGetAssociationMixin<Mentors>;
    public setMentor: Sequelize.BelongsToSetAssociationMixin<Mentors, Mentors['id']>;
    public createMentor: Sequelize.BelongsToCreateAssociationMixin<IMentorEntity>;

    // Propositions
    public getPropositions: Sequelize.HasManyGetAssociationsMixin<MPs>;
    public addProposition: Sequelize.HasManyAddAssociationMixin<MPs, MPs['id']>;
    public createProposition: Sequelize.HasManyCreateAssociationMixin<IMentoringPropositionEntity>;
    public hasProposition: Sequelize.HasManyHasAssociationMixin<MPs, MPs['id']>;

    public readonly business?: Businesses | Businesses['id'];
    public readonly category?: InternshipTypes | InternshipTypes['id'];
    public readonly student?: Students | Students['id'];
    public readonly files?: Files[];
    public readonly mentor?: Mentors | Mentors['id'];
    public readonly propositions?: MPs[];
    public readonly availableCampaign?: Campaigns | Campaigns['id'];
    public readonly validatedCampaign?: Campaigns | Campaigns['id'];
}

Internships.init(
    {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        // Data
        subject: {
            type: new Sequelize.DataTypes.STRING(256),
            allowNull: false,
        },
        description: {
            type: new Sequelize.DataTypes.TEXT(),
            allowNull: true,
        },

        // Localisation
        country: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        city: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        postalCode: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        address: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        additional: {
            type: new Sequelize.DataTypes.STRING(),
            allowNull: true,
        },

        // State
        isInternshipAbroad: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isValidated: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        // Date
        startAt: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        endAt: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        tableName: 'internships',
        sequelize: database,
        defaultScope: {
            attributes: {
                exclude: [
                    'businessId',
                    'studentId',
                    'categoryId',
                    'availableCampaignId',
                    'validatedCampaignId',
                    'mentorId',
                ],
            },
        },
    },
);

export default Internships;
