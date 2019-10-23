const faker = require('faker');
const chalk = require('chalk');

const Mentors = require('../../../dist/models/Mentors').default;

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const mentor = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
        };
        promises.push(
            new Promise(async (resolve, reject) => {
                try {
                    await Mentors.create(mentor);
                    if (debug) console.info(chalk.white(`Inject mentor in database`));

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }),
        );
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} mentors in database`));
};
