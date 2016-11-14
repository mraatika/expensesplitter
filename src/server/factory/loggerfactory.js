import fs from 'fs';
import morgan from 'morgan';
import bunyan from 'bunyan';
import serverConf from 'server/conf/server.conf.json';

const conf = serverConf[process.env.NODE_ENV || 'dev'];

/**
 * Default logger properties
 * @type {Object}
 */
const _defaults = {

    access: {
        /**
         * Log file path
         * @type {string}
         */
        path: `./expensesplitter.access.${process.env.NODE_ENV || 'dev'}.log`,

        /**
         * Log format
         * @type {string}
         * @see https://github.com/expressjs/morgan
         */
        format: 'common'
    },

    process: {

        /**
          * Log level
          * Log file path
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
         * Log format
         * @type {string}
         * @see https://github.com/trentm/node-bunyan#serializers
          */
        serializers : bunyan.stdSerializers
    }

};

export default {
    /**
     * Create logger
     * @param  {string} type Logger type (access, process)
     * @param  {Object} [props] Logger properties
     * @return {Object} Logger instance
     */
    create: (type, props = {}) => {
        if (type === 'access') {
            const p = Object.assign({}, _defaults.access, props);
            const stream = fs.createWriteStream(p.path, { flags: 'a+' });
            return morgan(p.format, { stream });
        }

        return bunyan.createLogger(Object.assign({}, _defaults.process, props));
    }
};