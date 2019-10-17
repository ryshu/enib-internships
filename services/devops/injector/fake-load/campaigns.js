const faker = require('faker');
const chalk = require('chalk');

const Campaigns = require('../../../dist/models/Campaigns').default;

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const campaign = {
            name: faker.lorem.words(3),
            startAt: faker.random.number({ min: 1571347682, max: 1576618082 }),
            endAt: faker.random.number({ min: 1576618082, max: 1581974882 }),
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
            maxPropositions: faker.random.number(20),
        };
        promises.push(
            new Promise(async (resolve, reject) => {
                try {
                    await Campaigns.create(campaign);
                    if (debug)
                        console.info(chalk.white(`Inject campaign "${campaign.name}" in database`));

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }),
        );
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} campaigns in database`));
};
