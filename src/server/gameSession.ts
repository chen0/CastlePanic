import * as _ from 'lodash';
import niceware from 'niceware';
import {DBConnector} from './database/database';
import {GameState} from './gameState'; 

export class GameSession {

    private code: string;
    private state: GameState;
    private created: Date;

    constructor() {
        this.code = '';
        this.created = new Date();
        this.state = new GameState();
        // TODO: Should create a new Game State
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
        this.state.setSessionID(this.code);

        let queryStr: string = `INSERT INTO Games (code, created, state)
         VALUES ('${this.code}','${this.getTimeStamp()}','${this.state.toString()}')`;

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
