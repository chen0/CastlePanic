import * as express from 'express';
import * as _ from 'lodash';
import {GameSession} from './gameSession';
import Server from './server';

export class Api {

    constructor() {

        // creates api routes
        Server.getRouter().post('/api/newGame', this.newGame);
        Server.getRouter().post('/api/joinGame', this.joinGame);
        Server.getRouter().post('/api/lobby', this.lobby);
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

    /**
     * Requests name and gameCode from incoming json object
     * Checks if given both parameters, if so calls addUser, else returns error
     * Returns boolean of success of joining game
     */
    private joinGame(request: express.Request, response: express.Response): void {
        let name = _.get( request, 'body.name', '');
        let gameCode = _.get( request, 'body.gameCode', '');
        
        if (!_.isEqual(name, '') && !_.isEqual(gameCode, '')) {
            GameSession.addUser(name, 'player', gameCode, (success: boolean) => {
                response.json({success});
            });
        } else {
            let data = {
                error: 'Error: Missing parameter(s) in joinGame request'
            };
            response.json(data);
        }
    }

    /** 
     * Requests the name and gameCode from json
     * Checks if given both parameters, if so calls getLobby, else returns error
     * Returns json object with string array of all names associated with the gameCode
     * and the role of the player requesting the lobby
     */
    private lobby(request: express.Request, response: express.Response): void {
        let name = _.get( request, 'body.name', '');
        let gameCode = _.get( request, 'body.gameCode', '');

        if (!_.isEqual(name, '') && (!_.isEqual(gameCode, ''))) {
            GameSession.getLobby(gameCode, name, (names: string[], role: string) => {
                let data = {
                    "Users": names,
                    role
                };
                response.json(data);
            });
        } else {
            let data = {
                error: 'Error: Missing parameter(s) in lobby request'
            };
            response.json(data);
        }
    }
}
