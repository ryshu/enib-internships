const faker = require('faker');
const chalk = require('chalk');

faker.locale = 'fr';
const Internships = require('../../../dist/models/Internships').default;

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const internship = {
            subject: faker.lorem.lines(1),
            description: faker.lorem.paragraph(5),
            country: faker.address.country(),
            city: faker.address.city(),
            postalCode: faker.address.zipCode(),
            address: faker.address.streetAddress(),
            additional: faker.address.secondaryAddress(),
            isInternshipAbroad: faker.random.boolean(),
            isValidated: faker.random.boolean(),
        };
        promises.push(
            new Promise(async (resolve, reject) => {
                try {
                    await Internships.create(internship);
                    if (debug)
                        console.info(
                            chalk.white(`Inject internships "${internship.subject}" in database`),
                        );

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }),
        );
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} internships in database`));
};
