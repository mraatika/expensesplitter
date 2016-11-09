import config from 'server/conf/db.conf.json';
import nano from 'nano';
import {getCookie} from 'server/database/dbauthorization';

/**
 * Create database connection
 * @return {Object} Connection instance
 */
export const connect = (username, password) => {
    // configuration for current environment
    const conf = config[process.env.NODE_ENV || 'dev'];
    const {protocol, host, port, db_name} = conf;
    let conn;

    if (username && password) {
        conn = nano(`${protocol}${username}:${password}@${host}:${port}`);
    } else {
        conn = nano({ url: `${protocol}${host}:${port}`, cookie: getCookie() });
    }

    return conn.use(db_name);
};

export const connection = connect();