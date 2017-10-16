import { JsonConvert, JsonObject, JsonProperty, } from 'json2typescript';
import * as _ from 'lodash';
import { Card } from './deck/card';
import { CardToolkit } from './deck/cardtoolkit';
import { Monster } from './monsters/monster';
import { MonsterToolkit } from './monsters/toolkit';
import { Player } from './player';
import { Tower } from './tower';

@JsonObject
export class GameState {

    public static readonly MAX_HAND_SIZE: number = 5;

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
            player.assignHand(CardToolkit.assignCardTypes(player.showCards()));
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
	
	@JsonProperty('loss', Boolean)
 	private loss: boolean = false;
	
	@JsonProperty('win', Boolean)
	private win: boolean = false;

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

    public finishTurn(): number {
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
                    player.addCard(this.drawCard());
                }
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
	
	
	public drawMonster(): Monster{
		let drawnMonster: Monster = this.monsters.pop();
		
		if (_.isEqual(undefined, drawnMonster)) {
			// Figure out a way to end the game here.
			this.win = true;
//			finishTurn();
		}
		return drawnMonster;
	}

    /**
     * Moves all the monsters that are on the board forward or clockwise.
     * 
     * @memberof GameState
     */
    public moveAllMonsters(): void {
        let remainingMonsters: Monster[] = [];

        _.forEach(this.monsters, (monster) => {
            // move monster forward
            let killed: boolean = monster.moveForward(this.towers);

            if ( !killed ) {
                remainingMonsters.push( monster );
            }
        });

        // update monsters
        this.monsters = remainingMonsters;
    }

    /**
     * Starts the next player's turn.
     */
    public nextTurn(): void {
        this.turnNum++;
        let player: Player = this.currentTurn();

        // number of cards to draw
        let numCards: number = GameState.MAX_HAND_SIZE - player.showCards().length;

        // draw up
        for (let i = 0; i < numCards; i++) {
            player.addCard( this.drawCard() );
        }
    }

    /**
     * Ends a players turn. Can only be called after the game has started with the current player's username.
     * moves monsters forward, checks if game is over, and places new monsters.
     * 
     * @param {string} userName     - user name of player who is ending their turn.
     * @returns {boolean}           - true if turn ended successfully, false if turn was not ended.
     * @memberof GameState
     */
    public endTurn(userName: string): boolean {
        if (this.hasStarted() && _.isEqual( this.currentTurn().showPlayerID(), userName) ) {
            this.moveAllMonsters();
			this.loss = true;
			for( i = 0; i++; i < this.tower.length ) {
				if (towers.isStanding(tower[i])){
					this.loss = false;
				}
			}
			if (this.loss == true){
				// make class/function call to loss.
			}
            // TODO: check if game is over
            // TODO: place new monsters
            this.nextTurn();
            return true;
        } else {
            return false;
        }
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
