const faker = require('faker');
const chalk = require('chalk');

faker.locale = 'fr';
const Mentors = require('../../../dist/models/sequelize/Mentors').default;

async function inject(m, debug) {
    await Mentors.create(m);
    if (debug) console.info(chalk.white(`Inject mentor in database`));
}

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const mentor = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            role: 'default',
        };
        promises.push(inject(mentor, debug));
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} mentors in database`));
};
