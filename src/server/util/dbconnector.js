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
    const conf = config[process.env.NODE_ENV || 'dev'];
    const {protocol, username, password, host, port, db_name} = conf;
    return nano(`${protocol}${username}:${password}@${host}:${port}`).use(db_name);
};

export default {
    /**
     * Return the connection instance. Will initialize the instance if not yet initialized.
     * @return {Object} Database connecton instance
     */
    getDbConnection: () => connection || connect()
};