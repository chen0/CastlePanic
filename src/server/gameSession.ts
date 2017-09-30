import * as _ from 'lodash';
import niceware from 'niceware';
import {DBConnector} from './database/database';
import {GameState} from './gameState';
import {Goblin} from './monsters/goblin';
import {Monster} from './monsters/monster';
import {Troll} from './monsters/troll';

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
    
    /**
     * Queries the DB and retrieves all names associated with the gameCode 
     * and the role associated with the parameter name
     */
    public static getLobby(gameCode: string, name: string, callback: (names: string[], role: string) => void) {
        let queryStr = `select name, role from Users where game_code='${gameCode}';`;
        let db = new DBConnector();
        db.query(queryStr, (err: any, rows: any, fields: any) => {
            db.close();
            let names: string[] = [];
            let role: string = '';

            _.forEach(rows, (user) => {
                let getName = _.get(user, 'name', '');
                names.push(getName);
                if (_.isEqual(name, getName)) {
                    role = _.get(user, 'role', '');
                }
            });
            callback(names, role);
        });
    }
    
    /**
     * Given a game code this will query a gameSession and parse the gameState.
     * 
     * @static
     * @param {string} gameCode - code of session to retrieve
     * @param {(session: GameSession) => void} callback - game session
     * @memberof GameSession
     */
    public static getSession(gameCode: string, callback: (session: GameSession) => void) {
        let str = `SELECT state, created FROM Games WHERE code='${gameCode}';`;
        let db = new DBConnector();
        db.query(str, (err: any, rows: any, fields: any) => {
            db.close();
            let row1 = _.head(rows);
            let state = _.get( row1, 'state', '');
            let created = _.get(row1, 'created', '');

            let gameState = GameState.parse(state);
            let session = new GameSession();

            session.setAttributes(gameCode, created, gameState);
            callback(session);
        });
    }

    private code: string;
    private state: GameState;
    private created: Date;

    constructor() {
        this.code = '';
        this.created = new Date();
        this.state = new GameState();
    }

    /**
     * Sets the following attributes of the gameSession
     * 
     * @param {string} code     - game code of session
     * @param {string} created  - date session was created
     * @param {GameState} state - state of the game
     * @memberof GameSession
     */
    public setAttributes(code: string, created: string, state: GameState) {
        this.code = code;
        this.created = new Date(created);
        this.state = state;
    }

    /**
     * Get the game state
     * 
     * @returns {GameState} 
     * @memberof GameSession
     */
    public getState(): GameState {
        return this.state;
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
        let word: string = niceware.generatePassphrase(2)[0];

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
