const faker = require('faker');
const chalk = require('chalk');

const Files = require('../../../dist/models/Files').default;

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const file = {
            name: faker.name.title(),
            size: faker.random.number({ min: 100, max: 100000 }),
            type: faker.random.arrayElement(['jpg', 'jpeg', 'png']),
            path: faker.internet.url(),
        };
        promises.push(
            new Promise(async (resolve, reject) => {
                try {
                    await Files.create(file);
                    if (debug) console.info(chalk.white(`Inject file "${file.name}" in database`));

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }),
        );
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} files in database`));
};
