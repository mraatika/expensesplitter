import bunyan from 'bunyan';
import serverConf from 'server/conf/server.conf.json';

const conf = serverConf[process.env.NODE_ENV || 'dev'];

/**
 * Default logger properties
 * @type {Object}
 */
const _defaults = {
    /**
     * Log level
     * @type {string}
     * @see https://github.com/trentm/node-bunyan#levels
     */
    level: process.env.LOG_LEVEL || conf.log.level,
    /**
     * Log streams (file, stdout etc.)
     * @type {Array}
     */
    streams: conf.log.streams.map(c => {
        if (c.stream && c.stream === 'stdout') c.stream = process.stdout;
        return c;
    }),
    /**
     * Error serializer
     * @type {Object}
     */
    serializers : bunyan.stdSerializers
};

export default {
    /**
     * Create logger
     * @param  {Object} [props] Logger properties
     * @return {Object} Bunyan logger instance
     */
    create: props => bunyan.createLogger(Object.assign({}, _defaults, props))
};