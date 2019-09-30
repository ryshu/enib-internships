import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import './configs/instances/database'; // Only import to setup
import './configs/setup/database'; // Only import to setup

import logger from './utils/logger';

import { loadFakeBusinesses } from './configs/fake-load/businesses';

loadFakeBusinesses().then(() => {
    logger.info('Successfully setup data');
});
