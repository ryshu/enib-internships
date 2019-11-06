import * as Sequelize from 'sequelize';
import Internships from './Internships';
import database from '../configs/instances/database';

class Files extends Sequelize.Model implements IFileEntity {
    public static associations: {
        internship: Sequelize.Association<Files, Internships>;
    };
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public name: string;
    public size: number;
    public type: string;
    public path: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Internship
    public getInternship: Sequelize.BelongsToGetAssociationMixin<Internships>;
    public setInternship: Sequelize.BelongsToSetAssociationMixin<Internships, Internships['id']>;
    public createInternship: Sequelize.BelongsToCreateAssociationMixin<IInternshipEntity>;

    public readonly internship?: Internships[];
}

Files.init(
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
        size: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        type: {
            type: new Sequelize.DataTypes.STRING(20),
            allowNull: false,
        },
        path: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: 'files',
        sequelize: database,
        defaultScope: {
            attributes: { exclude: ['internshipId'] },
        },
    },
);

export default Files;
