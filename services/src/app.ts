import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression'; // compresses requests
import lusca from 'lusca';
import dotenv from 'dotenv';
import flash from 'express-flash';
import path from 'path';
import methodOverride from 'method-override';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env' });

// Loggers
import logger from './utils/logger';
import { APIError } from './utils/error';
import httpStatus from 'http-status-codes';

// router and database
import router from './configs/setup/route';
import './configs/instances/database'; // Only import to setup
import './configs/setup/database'; // Only import to setup

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.INTERNSHIP_ENIB_API_PORT || 3000);
app.use(compression());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(router);

/**
 * Error handler setup
 */
app.use(methodOverride());
app.use((err: APIError | Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof APIError) {
        return res.status(err.status).json(err);
    } else {
        logger.error(err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Internal server error`);
    }
});

export default app;
