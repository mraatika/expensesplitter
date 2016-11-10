import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import routes  from 'server/routes';
import LoggerFactory from 'server/factory/loggerfactory';
import serverConf from 'server/conf/server.conf.json';
import dbConf from 'server/conf/db.conf.json';
import errorHandler from 'server/middleware/errorhandler';
import authenticate from 'server/middleware/authorizationmiddleware';

// get correct configuration for the current environment
const conf = {
    server: serverConf[process.env.NODE_ENV || 'dev'],
    db: dbConf[process.env.NODE_ENV || 'dev']
};

const app = express();

// create logger for logging custom messages
const logger = LoggerFactory.create('process', { name: 'expensesplitter-server' });

// authenticate
app.use(authenticate());
// use access logger
app.use(LoggerFactory.create('access'));
// use body parser to parse json
// must be before route setup
app.use(bodyParser.json());
// use gzip comression
app.use(compression());
// use helmet to set security headers
app.use(helmet());
// set up routes, create process logger
routes(app, logger);
// use error handler (should be last use statement)
app.use(errorHandler(logger));

export default {
    /**
     * Start the server
     * @return {undefined}
     */
    start: () => {
        const server = app.listen(conf.server.port, () => {
            const {address, port} = server.address();
            console.log(`Server started and listening at ${address}${port}`);
        });

        return server;
    }
};