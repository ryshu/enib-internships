const faker = require('faker');
const chalk = require('chalk');

faker.locale = 'fr';
const Files = require('../../../dist/models/Files').default;

async function inject(f) {
    await Files.create(f);
    if (debug) console.info(chalk.white(`Inject file "${f.name}" in database`));
}

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const file = {
            name: faker.name.title(),
            type: faker.random.arrayElement(['jpg', 'jpeg', 'png']),
            path: faker.internet.url(),
        };
        promises.push(inject(file));
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} files in database`));
};
