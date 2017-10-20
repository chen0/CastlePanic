import * as express from 'express';
import * as _ from 'lodash';
import { GameSession } from './gameSession';
import Server from './server';

export class Api {

    constructor() {

        // creates api routes
        Server.getRouter().post('/api/newGame', this.newGame);
        Server.getRouter().post('/api/joinGame', this.joinGame);
        Server.getRouter().post('/api/lobbyInfo', this.lobby);
        Server.getRouter().post('/api/checkUser', this.checkUser);
        Server.getRouter().post('/api/checkGameCode', this.checkGameCode);
        Server.getRouter().post('/api/startGame', this.startGame);
        Server.getRouter().post('/api/endTurn', this.endTurn);
        Server.getRouter().post('/api/playCard', this.playCard);
        Server.getRouter().post('/api/checkSession', this.checkSession);
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
            if (!_.isEqual(name, '')) {
                GameSession.addUser(name, 'owner', gameCode, (success: boolean) => {
                    response.json({ gameCode });
                });
            } else {
                response.json({ gameCode });
            }
        });
    }

    private checkUser(request: express.Request, response: express.Response): void {
        let gameCode = _.get(request, 'body.gameCode', '');
        let name = _.get(request, 'body.name', '');

        if (!_.isEqual(name, '') && !_.isEqual(gameCode, '')) {
            GameSession.userExists(name, gameCode, (success: boolean) => {
                response.json({ success });
            });
        } else {
            let data = {
                error: 'Error: Missing parameter(s) in checkUser request'
            };
            response.json(data);
        }
    }

    private checkGameCode(request: express.Request, response: express.Response): void {
        let name = _.get(request, 'body.gameCode', '');

        if (!_.isEqual(name, '')) {
            GameSession.gameCodeExists(name, (success: boolean) => {
                response.json({ success });
            });
        } else {
            let data = {
                error: 'Error: Missing parameter(s) in checkGameCode request'
            };
            response.json(data);
        }
    }

    /**
     * Requests name and gameCode from incoming json object
     * Checks if given both parameters, if so calls addUser, else returns error
     * Returns boolean of success of joining game
     */
    private joinGame(request: express.Request, response: express.Response): void {
        let name = _.get(request, 'body.name', '');
        let gameCode = _.get(request, 'body.gameCode', '');

        if (!_.isEqual(name, '') && !_.isEqual(gameCode, '')) {
            GameSession.lobbyFull(gameCode, (isFull: boolean) => {
                if(!isFull) {
                    GameSession.addUser(name, 'player', gameCode, (success: boolean) => {
                        response.json({ success });
                    });
                } else {
                    response.json({isFull});
                }
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
        let name = _.get(request, 'body.name', '');
        let gameCode = _.get(request, 'body.gameCode', '');

        if (!_.isEqual(name, '') && (!_.isEqual(gameCode, ''))) {
            GameSession.getLobby(gameCode, name, (names: string[], role: string[]) => {
                let data = {
                    users: names,
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

    private checkSession(request: express.Request, response: express.Response): void {
        let gameCode = _.get(request, 'body.gameCode', '');

        if (!_.isEqual(gameCode, '')) {
            GameSession.getSession(gameCode, (session: GameSession) => {
                response.json(session);
            });
        } else {
            let data = {
                error: 'Error: Missing parameter(s) in session request'
            };
            response.json(data);
        }
    }

    /**
     * Handles a request to start the game. The game can only be started by the same user that created the session.
     * A valid name and gameCode need to be sent to /api/startGame to work.
     * @param request 
     * @param response 
     */
    private startGame(request: express.Request, response: express.Response): void {
        let name = _.get(request, 'body.name', '');
        let gameCode = _.get(request, 'body.gameCode', '');

        if (!_.isEqual(name, '') && !_.isEqual(gameCode, '')) {
            GameSession.startGame(gameCode, name, (success: boolean) => {
                response.json({ success });
            });
        } else {
            response.json({ success: false, error: 'Error: Missing parameter(s)' });
        }
    }

    /**
     * Handles a request to end a player's turn. send name, gameCode to /api/endTurn.
     * The name and gameCode need to be valid and the name must be the name of the current users turn.
     * @param request 
     * @param response 
     */
    private endTurn(request: express.Request, response: express.Response): void {
        let name = _.get(request, 'body.name', '');
        let gameCode = _.get(request, 'body.gameCode', '');

        if (!_.isEqual(name, '') && !_.isEqual(gameCode, '')) {
            GameSession.getSession(gameCode, (session: GameSession) => {

                if (!_.isEqual(session, null) && !session.isSessionOver()) {

                    let state = session.getState();

                    let success = state.endTurn(name);
                    if (success) {
                        session.save(() => {
                            response.json({ success });
                        });
                    } else {
                        response.json({ success, error: 'Error: could not end turn' });
                    }

                } else {
                    let data: any = {success: false};
                    if ( session.isSessionOver() ) {
                        data.error  = 'Error: Game is over';
                    } else {
                        data.error = 'Error: name or gameCode is invalid';
                    }
                    // session did not exist
                    response.json(data);
                }
            });
        } else {
            response.json({ success: false, error: 'Error: Missing parameter(s)' });
        }
    }

    /**
     * Requests gameCode, name, cardIndex and monsterIndex from incoming json object
     * Checks if given all parameters, if so calls playCard, else returns error
     * Returns boolean of success of playing the card
     */
    private playCard(request: express.Request, response: express.Response): void {
        let gameCode = _.get(request, 'body.gameCode', '');
        let name = _.get(request, 'body.name', '');
        let cardIndex = _.get(request, 'body.cardIndex', -1);
        let monsterIndex = _.get(request, 'body.monsterIndex', -1);

        if (!_.isEqual(name, '') && !_.isEqual(gameCode, '') &&
            !_.isEqual(cardIndex, -1) && !_.isEqual(monsterIndex, -1)) {
            GameSession.getSession(gameCode, (session: GameSession) => {
                if (!session.isSessionOver()) {
                    session.playCard(gameCode, name, cardIndex, monsterIndex, (success: boolean) => {
                        response.json({ success });
                    });
                } else {
                    response.json({success: false, error: 'Error: Game is over'});
                }
            });
        } else {
            let data = {
                error: 'Error: Missing parameter(s) in playCard request'
            };
            response.json(data);
        }
    }
}
