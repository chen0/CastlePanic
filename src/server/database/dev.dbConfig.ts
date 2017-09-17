import {DBConfig} from './database';

// Configuration for mysql running in virtual box
let dbConfig: DBConfig = {
    host: '10.10.4.15',
    user: 'app',
    password: 'apppassword',
    database: 'CastlePanicDB'
};

export default dbConfig;