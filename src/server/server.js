import restify from 'restify';
import routes  from 'server/routes';
import LoggerFactory from 'server/factory/loggerfactory';
import serverConf from 'server/conf/server.conf.json';

// get correct configuration for the current environment
const conf = serverConf[process.env.NODE_ENV || 'dev'];

const appName = 'expensesplitter-server';

const server = restify.createServer({
    name : appName,
    log  : LoggerFactory.create({ name: appName })//,
    //formatters : {
        //'application/json' : function (req, res, body) {
            //res.setHeader('Cache-Control', 'must-revalidate');

            // Does the client *explicitly* accepts application/json?
            //var sendPlainText = (req.header('Accept').split(/, */).indexOf('application/json') === -1);

            // Send as plain text
            //if (sendPlainText) {
            //    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            //}

            // Send as JSON
            //if (!sendPlainText) {
            //    res.setHeader('Content-Type', 'application/json; charset=utf-8');
            //}
            //return JSON.stringify(body);
        //}
    //}
});

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.gzipResponse());

server.pre(restify.pre.sanitizePath());

// Default error handler. Personalize according to your needs.
server.on('uncaughtException', (req, res, err) => {
    server.log.error({ err: err });
    res.send(500, { success : false });
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