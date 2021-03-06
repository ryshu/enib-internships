const faker = require('faker');
const chalk = require('chalk');

faker.locale = 'fr';
const Internships = require('../../../dist/models/sequelize/Internships').default;
const InternshipTypes = require('../../../dist/models/sequelize/InternshipTypes').default;

const categories = require('../../../dist/configs/data/categories').defaultCategories;

async function inject(i, category, debug) {
    const created = await Internships.create(i);
    await created.setCategory(category);
    if (debug) console.info(chalk.white(`Inject internships "${i.subject}" in database`));
}

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];

    // Get all types to associate a type to our fake categories
    const types = await InternshipTypes.findAll();
    // If label doesn't exist, inject them
    if (types.length !== categories.length) {
        const todo = Object.assign([], categories);
        types.forEach((t) => {
            const found = todo.findIndex((td) => td === t.label);
            if (found !== -1) todo.splice(found, 1);
        });
        await Promise.all(todo.map((t) => InternshipTypes.create({ label: t })));
    }

    // Force 70% of q to France
    const gap = Math.round(quantity * 0.7);

    for (let i = 0; i < quantity; i++) {
        const internship = {
            subject: faker.lorem.lines(1),
            description: faker.lorem.paragraph(5),
            country: i > gap ? faker.address.country() : 'France',
            city: faker.address.city(),
            postalCode: faker.address.zipCode(),
            address: faker.address.streetAddress(),
            additional: faker.address.secondaryAddress(),
            isInternshipAbroad: faker.random.boolean(),
        };
        promises.push(
            inject(
                internship,
                types[faker.random.number({ min: 0, max: categories.length - 1 })],
                debug,
            ),
        );
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} internships in database`));
};
