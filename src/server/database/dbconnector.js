import config from 'server/conf/db.conf.json';
import nano from 'nano';

/**
 * Create database connection
 * @return {Object} Connection instance
 */
export const connect = () => {
    // configuration for current environment
    const conf = config[process.env.NODE_ENV || 'dev'];
    const {protocol, username, password, host, port, db_name} = conf;
    return nano(`${protocol}${username}:${password}@${host}:${port}`).use(db_name);
};

export const connection = connect();