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

        // Convert cards in a player's hand to it's correct type
        _.forEach(obj.players, (player: Player) => {
            player.assignHand( CardToolkit.assignCardTypes( player.showCards() ) );
        });

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
	
	@JsonProperty('winloss', Boolean)
	private winloss: boolean = null;

    constructor() {
        this.sessionId = '123';
        this.monsters = [];
        this.players = [];
        this.owner = 'owner';
        this.turnNum = 0;
        this.cards = [];
        this.towers = [];
        this.started = false;
		this.winloss = null;
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

    /**
     * Adds the player to the players array, and returns a reference to the new player
     * 
     * @param {string} userid       - name of player
     * @returns {Player}            - reference to player
     * @memberof GameState
     */
    public addPlayer(userid: string): Player {
        let player: Player = new Player(userid);
        this.players.push(player);
        return player;
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
	
	//thinking about putting a check in the finishturn function 
	//to check if a bool representing the win/loss condition returns true, false, or null. 
	//if true, players win game
	//if false, players lose
	//if null, play continues
	//The way I'm thinking this happens, is that
	//we call a function from some class (haven't looked into which one)
	//that contains a function to end the game as a loss or end it as a win
	//I've used temp function values below.
	
    public finishTurn(): number {
		if(_.isEqual(winloss, 'false')){
			//class.lossconditionclosegame;
		}
		else if(_.isEqual(winloss, 'true')){
			//class.winconditionendgame;
		}
		//else, but if it has hit this, it should mean that neither above statement are true as 
		//that would end the game on the spot.
        return this.turnNum++;
    }

    public getMonsters(): Monster[] {
        return this.monsters;
    }

    public getCards(): Card[] {
        return this.cards;
    }

    public hasStarted(): boolean {
        return this.started;
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
                // create the player
                let player = this.addPlayer(name);

                // deal the player some cards
                for (let i = 0; i < 5; i++) {
                    player.addCard( this.drawCard() );
                }
            });

            // TODO randomly place first set of monsters
        }
    }
	
	public drawMonster(): Monster{
		let drawnMonster: Monster = this.monsters.pop();
//		if(_.isEqual(undefined, drawnMonster)){
			//Figure out a way to end the game here.
//			this.winloss = true;
//			finishTurn();
		}
		return drawnMonster;
	}
	
	public loseGame(): boolean{
		return false;
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
