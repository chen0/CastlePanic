import * as express from 'express';
import {GameSession} from './gameSession';
import Server from './server';

export class Api {

    constructor() {

        // creates api routes
        Server.getRouter().post('/api/newGame', this.newGame);
    }

    /**
     * Handles a request to create a new game session and returns a json response containing the gameCode
     *
     * @private
     * @param {express.Request} request
     * @param {express.Response} response
     * @memberof Api
     */
    private newGame(request: express.Request, response: express.Response): void {
        let gameSession = new GameSession();
        
        // creates session code and saves session
        gameSession.generateCode( () => {
            
            // TODO: should probably add the current user to gameSession
            let data = {
                gameCode: gameSession.getCode()
            };
            response.json(data);
        });
    }
}
