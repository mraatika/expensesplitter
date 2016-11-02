import restify from 'restify';
import routes  from 'server/routes';
import LoggerFactory from 'server/factory/loggerfactory';
import serverConf from 'server/conf/server.conf.json';
import {t} from 'common/dictionary/dictionary';

// get correct configuration for the current environment
const conf = serverConf[process.env.NODE_ENV || 'dev'];

const appName = 'expensesplitter-server';

const server = restify.createServer({
    name : appName,
    log  : LoggerFactory.create({ name: appName })
});

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.gzipResponse());

server.pre(restify.pre.sanitizePath());

// Default error handler. Personalize according to your needs.
server.on('uncaughtException', (req, res, err) => {
    server.log.error('Uncaught error happened', err);
    res.send(new restify.InternalServerError(t('error.server.internal_server_error')));
});

//server.on('after', restify.auditLogger({ log: server.log }));

routes(server);

export default {
    /**
     * Start the server
     * @return {undefined}
     */
    start: () => {
        console.log(`Server started on port ${conf.port}.`);

        server.listen(conf.port, () => {
            server.log.info(`${server.name} listening at ${server.url}`);
        });
    }
};