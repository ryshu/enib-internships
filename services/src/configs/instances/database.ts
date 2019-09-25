import { Sequelize } from 'sequelize';

// ORM connection initialization
export default new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
    },
);
