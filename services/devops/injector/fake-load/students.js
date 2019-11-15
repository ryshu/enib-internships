const faker = require('faker');
const chalk = require('chalk');

faker.locale = 'fr';
const Students = require('../../../dist/models/Students').default;

async function inject(s) {
    await Students.create(s);
    if (debug)
        console.info(chalk.white(`Inject students "${s.firstName} ${s.lastName}" in database`));
}

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const student = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            semester: faker.random.arrayElement([
                'S1',
                'S2',
                'S3',
                'S4',
                'S5',
                'S6',
                'S7',
                'S8',
                'S9',
                'S10',
            ]),
        };
        promises.push(inject(student));
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} students in database`));
};
