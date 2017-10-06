import { JsonConvert, JsonObject, JsonProperty, } from 'json2typescript';
import * as _ from 'lodash';
import { Card } from './deck/card';
import { CardToolkit } from './deck/cardtoolkit';
import { Monster } from './monsters/monster';
import { MonsterToolkit } from './monsters/toolkit';
import {Player} from './player';
import { Tower } from './tower';

@JsonObject
export class GameState {

    /**
     * Parses a string into a fully functionaly GameState object
     * 
     * @static
     * @param {string} state - string containing the state of the game
     * @returns {GameState}  - game state
     * @memberof GameState
     */
    public static parse(state: string): GameState {
        let converter = new JsonConvert();

        // convert string to json
        let json = JSON.parse(state);

        // convert json object to a typescript object
        let obj = converter.deserializeObject(json, GameState);

        // Convert each element in Monster array into their correct types
        obj.monsters = MonsterToolkit.assignMonsterTypes(obj.monsters);
        obj.cards = CardToolkit.assignCardTypes(obj.cards);
        return obj;
    }

    @JsonProperty('gameCode', String)
    private sessionId: string = '';

    @JsonProperty('started', Boolean)
    private started: boolean = false;

    @JsonProperty('monsters', [Monster])
    private monsters: Monster[] = [];

    @JsonProperty('players', [Player])
    private players: Player[] = [];

    @JsonProperty('owner', String)
    private owner: string = '';

    @JsonProperty('turnNum', Number)
    private turnNum: number = 0;

    @JsonProperty('cards', [Card])
    private cards: Card[] = [];

    @JsonProperty('towers', [Tower])
    private towers: Tower[] = [];

    constructor() {
        this.sessionId = '123';
        this.monsters = [];
        this.players = [];
        this.owner = 'owner';
        this.turnNum = 0;
        this.cards = [];
        this.towers = [];
        this.started = false;
    }

    public setSessionID(sessionid: string): void {
        this.sessionId = sessionid;
    }

    public getSessionID(): string {
        return this.sessionId;
    }

    public setOwner(userid: string): void {
        this.owner = userid;
    }

    public addPlayer(userid: string): void {
        this.players.push(new Player(userid));
    }

    /**
     * return all players in this game session
     * 
     * @returns [Player] 
     */
    public getPlayers(): Player[] {
        return this.players;
    }

    /**
     * return the player for the current turn
     * 
     * @returns Player
     */
    public currentTurn(): Player {
        return this.players[this.turnNum % this.players.length];
    }

    public finishTurn(): number {
        return this.turnNum++;
    }

    public getMonsters(): Monster[] {
        return this.monsters;
    }

    public getCards(): Card[] {
        return this.cards;
    }

    /**
     * Should be called at the begining of the Game to place all objects into their starting positions.
     * 
     * @param {string[]} names - names of players to include in the game
     * @memberof GameState
     */
    public initializeGame(names: string[]) {
        if (!this.started) {
            this.started = true;
            this.monsters = MonsterToolkit.getMonsters();
            this.cards = CardToolkit.getCards();
            this.towers = Tower.createTowers();

            _.forEach(names, (name: string) => {
                this.addPlayer(name);
                // TODO deal cards
            });

            // TODO randomly place first set of monsters
        }
    }

    public drawCard(): Card {
        let drawnCard: Card = this.cards.pop();
        if (_.isEqual(undefined, drawnCard)) {
            this.cards = CardToolkit.getCards();
            return this.cards.pop();
        }
        return drawnCard;
    }

    /**
     * Converts GameState object into a string that can be stored in a database
     * 
     * @returns {string} 	- string representation of game state
     * @memberof GameState
     */
    public toString(): string {
        let converter = new JsonConvert();
        let json = converter.serialize(this);
        return JSON.stringify(json);
    }
}
