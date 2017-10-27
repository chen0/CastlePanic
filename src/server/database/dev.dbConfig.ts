import {ServerConfig} from '../server';
import {DBConfig} from './database';

// Configuration for mysql running in virtual box
export let dbConfig: DBConfig = {
    host: '10.10.4.15',
    user: 'app',
    password: 'apppassword',
    database: 'CastlePanicDB'
};

// Server configuration
export let serverConfig: ServerConfig = {
    port: 8000
};
