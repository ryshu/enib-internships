import faker from 'faker';

import Businesses from '../../models/Businesses';

import logger from '../../utils/logger';

export async function loadFakeBusinesses() {
    const promises = [];
    for (let i = 0; i < 1000; i++) {
        const business: IBusinessEntity = {
            name: faker.company.companyName(),
            country: faker.address.country(),
            city: faker.address.city(),
            postalCode: faker.address.zipCode(),
            address: faker.address.streetAddress(),
            additional: faker.address.secondaryAddress(),
        };
        promises.push(Businesses.create(business));
    }

    await Promise.all(promises);
    logger.info('Successfully inject 1000 businesses in database');
}
