import config from 'server/conf/db.conf.json';
import nano from 'nano';

// connection instance
let connection;

/**
 * Create database connection
 * @return {Object} Connection instance
 */
const connect = () => {
    // configuration for current environment
    const dbConfig = config[process.env.NODE_ENV || 'dev'];
    return nano(dbConfig.url + ':' + dbConfig.port).use(dbConfig.db_name);
};

export default {
    /**
     * Return the connection instance. Will initialize the instance if not yet initialized.
     * @return {Object} Database connecton instance
     */
    getDbConnection: () => connection || connect()
};