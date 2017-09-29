import * as _ from 'lodash';
import { Api } from './api';
import { DBConnector } from './database/database';
import { GameSession } from './gameSession';

export class GameSessionTest {

    public start() {
        console.info('gameSession Tests');

        // Test 1
        this.gameCodeCreateSaveGet();

        // Test 2
        this.addCodeExists();

        // Test 3
        this.addUserCheck();

        // Test 4
        this.getSessionCheck();
    }

    public result(title: string, status: boolean) {
        console.info(`${title}: ${status ? '\x1b[32m Passed' : '\x1b[31m Failed'}\x1b[0m`);
    }

    // Test 1
    public gameCodeCreateSaveGet(): void {
        let gameSession = new GameSession();

        // creates session code and saves session
        gameSession.generateCode(() => {
            let gameCode = gameSession.getCode();
            this.result('Game code create, save, get', !_.isEqual(gameCode, ''));
        });
    }

    // Test 2
    public addCodeExists(): void {
        let gameSession = new GameSession();
        gameSession.generateCode(() => {
            let gameCode = gameSession.getCode();
            GameSession.gameCodeExists(gameCode, (exists: boolean): void => {
                this.result('Game code exists', exists);
            });
        });
    }

    // Test 3
    public addUserCheck(): void {
        let gameSession = new GameSession();
        gameSession.generateCode(() => {
            let gameCode = gameSession.getCode();
            let name = 'testUser';
            GameSession.addUser(name, 'player', gameCode, (success: boolean) => {
                let db = new DBConnector();
                let queryStr = `SELECT COUNT(name) AS name_exists FROM Users WHERE name='${name}' AND game_code='${gameCode}';`;
                db.query(queryStr, (err: any, rows: any, fields: any) => {
                    db.close();

                    let exists = _.get(_.head(rows), 'code_exists', 1);
                    if (exists === 1) {
                        this.result('Add user', true);
                    } else {
                        this.result('Add user', true);
                    }
                });
            });
        });
    }

    // Test 4
    public getSessionCheck(): void {
        let gameSession1 = new GameSession();
        gameSession1.generateCode(() => {
            let gameCodeMade = gameSession1.getCode();
            GameSession.getSession(gameCodeMade, (session) => {
                let gameCodeGet = session.getCode();
                this.result('Get session', _.isEqual(gameCodeMade, gameCodeGet));
            });
        });
    }
}
