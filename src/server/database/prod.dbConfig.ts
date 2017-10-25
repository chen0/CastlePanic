import {ServerConfig} from '../server';
import {DBConfig} from './database';

// Configuration for mysql running in virtual box
export let dbConfig: DBConfig = {
    host: 'localhost',
    user: 'app',
    password: 'applive',
    database: 'CastlePanicDB'
};

// Server configuration
export let serverConfig: ServerConfig = {
    port: 80
};
