const faker = require('faker');
const chalk = require('chalk');

const InternshipTypes = require('../../../dist/models/InternshipTypes').default;

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const internshipTypes = {
            label: faker.lorem.words(3),
        };
        promises.push(
            new Promise(async (resolve, reject) => {
                try {
                    await InternshipTypes.create(internshipTypes);
                    if (debug) console.info(chalk.white(`Inject internship type in database`));

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }),
        );
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} internship types in database`));
};
