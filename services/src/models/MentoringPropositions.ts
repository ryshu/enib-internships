import { Model, DataTypes } from 'sequelize';

import database from '../configs/instances/database';

class MentoringPropositions extends Model implements IMentoringPropositionEntity {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.

    public comment: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

MentoringPropositions.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        comment: {
            type: new DataTypes.TEXT(),
            allowNull: true,
        },
    },
    {
        tableName: 'mentoring-propositions',
        sequelize: database,
    },
);

export default MentoringPropositions;
