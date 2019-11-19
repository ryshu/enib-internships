const faker = require('faker');
const chalk = require('chalk');

faker.locale = 'fr';
const Businesses = require('../../../dist/models/Businesses').default;

async function inject(business, debug) {
    await Businesses.create(business);
    if (debug) console.info(chalk.white(`Inject businesses "${business.name}" in database`));
}

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const business = {
            name: faker.company.companyName(),
            country: faker.address.country(),
            city: faker.address.city(),
            postalCode: faker.address.zipCode(),
            address: faker.address.streetAddress(),
            additional: faker.address.secondaryAddress(),
        };
        promises.push(inject(business, debug));
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} businesses in database`));
};
