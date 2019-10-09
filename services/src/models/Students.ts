import { Model, DataTypes } from 'sequelize';

import database from '../configs/instances/database';

class Students extends Model implements IStudentEntity {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public firstName: string;
    public lastName: string;
    public email: string;
    public semester: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Students.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        lastName: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        semester: {
            type: new DataTypes.STRING(3),
            allowNull: false,
        },
    },
    {
        tableName: 'students',
        sequelize: database,
    },
);

export default Students;
