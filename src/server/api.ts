import * as express from 'express';
import * as _ from 'lodash';
import { GameSession } from './gameSession';
import Server from './server';

export class Api {

    constructor() {

        // creates api routes
        Server.getRouter().post('/api/newGame', this.newGame);
        Server.getRouter().post('/api/joinGame', this.joinGame);
    }

    /**
     * Handles a request to create a new game session and returns a json response containing the gameCode.
     * Request json should contain { name } and response contains { gameCode }
     *
     * @private
     * @param {express.Request} request
     * @param {express.Response} response
     * @memberof Api
     */
    private newGame(request: express.Request, response: express.Response): void {
        let gameSession = new GameSession();

        let name = _.get(request, 'body.name', '');

        // creates session code and saves session
        gameSession.generateCode(() => {

            let gameCode = gameSession.getCode();

            // if name is provided add User as owner of game session
            if ( !_.isEqual(name, '') ) {
                GameSession.addUser(name, 'owner', gameCode, (success: boolean) => {
                    response.json( {gameCode} );
                });
            } else {
                response.json( {gameCode} );
            }
        });
    }

    /**
     * 
     */
    private joinGame(request: express.Request, response: express.Response): void {
        let name = _.get(request, 'body.name', '');
        let gameCode = _.get(request, 'body.gameCode', '');
        if (!_.isEqual(name, '') && !_.isEqual(gameCode, '')) {
            GameSession.userExists(name, gameCode, (exists: boolean) => {
                if (!exists) {
                    GameSession.addUser(name, 'player', gameCode, (success: boolean) => {
                        response.json({ success });
                    });
                } else {
                    response.json({success: false, error: 'name exists'});
                }
            });
        } else {
            let data = {
                error: 'Error: Missing parameter'
            };
            response.json(data);
        }
    }
}
