import { JsonConvert, JsonObject, JsonProperty,  } from 'json2typescript';
import * as _ from 'lodash';
import { Monster } from './monsters/monster';
import { MonsterToolkit } from './monsters/toolkit';
import {GamePlayers} from './gamePlayers'; 

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
        return obj;
    }

    @JsonProperty('gameCode', String)
    private sessionId: string = '';

    @JsonProperty('monsters', [Monster])
    private monsters: Monster[] = [];

    @JsonProperty('users', GamePlayers)
    private users: GamePlayers;

    constructor() {
        this.sessionId = '123';
        this.monsters = [];
    }

    public setSessionID(sessionid: string): void {
        this.sessionId = sessionid;
        this.createPlayerClass();
    }

    public getSessionID(): string {
        return this.sessionId;
    }

    public createPlayerClass(): void{
        this.users = new GamePlayers(this.sessionId);
    }

    public setOwner(userid: string): void {
        this.users.addOwner(userid);
    }
    
    public addPlayers(userid: string): void{
        this.users.addPlayers(userid);
    }

    public getOwner(): string {
        return this.users.getOwner();
    }

    public getPlayers(): string[] {
        return this.users.getPlayers();
    }

    public getMonsters(): Monster[] {
        return this.monsters;
    }


    /**
     * Should be called at the begining of the Game to place all objects into their starting positions.
     * 
     * @memberof GameState
     */
    public initializeGame() {

        this.monsters = MonsterToolkit.getMonsters();
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
