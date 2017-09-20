import * as _ from 'lodash';
import niceware from 'niceware';
import {DBConnector} from './database/database';

export class GameSession {

    public static gameCodeExists(gameCode: string, callback: (exists: boolean) => void): void {
        let db = new DBConnector();
        let queryStr = `SELECT COUNT(code) AS code_exists FROM Games WHERE code='${gameCode}';`;
        db.query(queryStr, (err: any, rows: any, fields: any) => {
            db.close();

            let exists = _.get( _.head(rows), 'code_exists', 1);
            if ( exists ) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }

    public static addUser(name: string, role: string, gameCode: string, callback: (success: boolean) => void) {
        GameSession.gameCodeExists(gameCode, (exists: boolean): void =>  {
            if ( exists ) {
                let str = `INSERT INTO Users (name,game_code,role) VALUES ("${name}","${gameCode}","${role}");`;
                let db = new DBConnector();
                db.query(str, (err: any, rows: any, fields: any) => {
                    db.close();
                    callback(true);
                });
            } else {
                    callback(false);
            }
        });
    }

    private code: string;
    private state: any;
    private created: Date;

    constructor() {
        this.code = '';
        this.created = new Date();
        // TODO: Should create a new Game State
        this.state = null;
    }

    /**
     * Gets the game code for the game session
     *
     * @returns {string}        - game session code
     * @memberof GameSession
     */
    public getCode(): string {
        return this.code;
    }

    /**
     * Generates a memorable game code and saves the game session in the database.
     * 
     * @param {() => void} callback     - function that gets called after the game session is saved in the database
     * @memberof GameSession
     */
    public generateCode(callback: () => void ): void {

        // generate memorable code
        let word: string = niceware.generatePassphrase(2);

        let db = new DBConnector();

        // get the number of times this code exists in the database
        let queryStr = `SELECT COUNT(code) AS code_exists FROM Games WHERE code='${word}'`;
        db.query( queryStr, (err: any, rows: any, fields: any) => {
            db.close();

            let exists = _.get( _.head(rows), 'code_exists', 1);
            if ( exists ) {
                this.generateCode(callback);
            } else {
                this.code = word;
                this.save(callback);
            }
        });
    }

    /**
     * Saves the game session in the database
     * 
     * @param {() => void} callback     - function that is called after session is saved in the database
     * @memberof GameSession
     */
    public save(callback: () => void): void {
        let db = new DBConnector();

        let queryStr: string = `INSERT INTO Games (code, created, state)
         VALUES ('${this.code}','${this.getTimeStamp()}','${this.state}')`;
        
        db.query( queryStr, (err: any, rows: any, fields: any) => {
            db.close();
            callback();
        });
    }

    /**
     * Gets a string representation of the created date
     * 
     * @private
     * @returns {string}        - when the game session was created
     * @memberof GameSession
     */
    public getTimeStamp(): string {
        let str = `${this.created.getFullYear()}-${this.created.getMonth()}-${this.created.getDate()} 
            ${this.created.getHours()}:${this.created.getMinutes()}:${this.created.getSeconds}`;
        return str;
    }
}
