const faker = require('faker');
const chalk = require('chalk');

const Businesses = require('../../../dist/models/Businesses').default;

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
        promises.push(
            new Promise(async (resolve, reject) => {
                try {
                    await Businesses.create(business);
                    if (debug)
                        console.info(
                            chalk.white(`Inject businesses "${business.name}" in database`),
                        );

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }),
        );
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} businesses in database`));
};
