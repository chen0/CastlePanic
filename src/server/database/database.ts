import * as mysql from 'mysql';
import {dbConfig} from './dbConfig';

/**
 * 
 * Minimum configuration that must be provided in dbConfig.ts
 * 
 * @export
 * @interface DBConfig
 */
export interface DBConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

/**
 * DBConnector serves as a Wrapper for communicating with the mysql database, it will also use the current
 * dbConfig.ts to determine what database to connect to
 * 
 * @export
 * @class DBConnector
 */
export class DBConnector {

    private config: DBConfig;
    private connection: mysql.IConnection;

    constructor() {
        this.config = dbConfig;
        this.connection = mysql.createConnection( this.config);
        this.connection.connect();
    }

    public query(query: string, callback: (err: mysql.IError , rows: any, fields: mysql.FieldType ) => void ) {
        this.connection.query( query, (err: mysql.IError, rows: any, fields: mysql.FieldType) => {

            // Always display sql errors if they exist
            if ( err !== null) {
                console.error(err);
            }
            
            callback(err, rows, fields);
        });
    }

    public close() {
        this.connection.end();
    }
}
