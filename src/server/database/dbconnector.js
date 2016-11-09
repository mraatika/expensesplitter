import config from 'server/conf/db.conf.json';
import nano from 'nano';

/**
 * Create database connection
 * @return {Object} Connection instance
 */
export const connect = () => {
    // configuration for current environment
    const dbConfig = config[process.env.NODE_ENV || 'dev'];
    return nano(dbConfig.url + ':' + dbConfig.port).use(dbConfig.db_name);
};

export const connection = connect();