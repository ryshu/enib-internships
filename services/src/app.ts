import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
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
import cas from './configs/setup/cas';
import './configs/instances/database'; // Only import to setup
import './configs/setup/database'; // Only import to setup
import expressSession from 'express-session';
import { handleConnection } from './api/cas/handle';

// Create Express server
const app = express();
export const session = expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
});

// Express configuration
app.set('port', process.env.INTERNSHIP_ENIB_API_PORT || 3000);
app.use(compression());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(session);

// CAS Setup
app.get('/logout', cas.logout); // Logout pass
app.use(
    '/',
    cas.bounce, // CAS bounce to connect user if isn't
    (req: Request, _res: Response, next: NextFunction) => {
        if (!req.session.info) {
            // If no session info, handle connection
            handleConnection(req)
                .then(() => next())
                .catch((e) => next(e));
        } else {
            // else, pass
            next();
        }
    },
    express.static(path.join(__dirname, 'public'), { maxAge: 0 }),
);
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
