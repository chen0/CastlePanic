import { JsonConvert, JsonObject, JsonProperty, } from 'json2typescript';
import * as _ from 'lodash';
import { Card } from './deck/card';
import { CardToolkit } from './deck/cardtoolkit';
import { Monster } from './monsters/monster';
import { MonsterToolkit } from './monsters/toolkit';
import { Player } from './player';
import { Position, Ring} from './position';
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

    @JsonProperty('monsterIndex', Number)
    private monsterIndex: number = 0;

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
        this.monsterIndex = 0;
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
    public initializeGame(names: string[], owner: string) {
        if (!this.started) {
            this.owner = owner;
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

            // randomly place first set of monsters
            this.drawMonsters();
            this.moveAllMonsters();

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
     * Checks if the game has been won
     * 
     * @returns {boolean} - true if game was won, false if not
     * @memberof GameState
     */
    public checkGameWon(): boolean {
        let monsters = _.filter(this.monsters, (m: Monster) => !m.isDead() );
        if ( _.isEqual(monsters.length, 0) ) {
            this.win = true;
            return true;
        } else {
            return false;
        }
    }

    public drawMonsters(): void {
        if ( this.checkGameWon() ) {
            return;
        }

        let randZone = _.shuffle([1, 2, 3, 4, 5, 6]);
        for (let i = 0; i < 2 && this.monsterIndex < this.monsters.length; i++ ) {
            let monster: Monster = this.monsters[this.monsterIndex];
            this.monsterIndex++;

            // makes sure you cannot draw two monsters to the same position
            let j = 0;
            let p = new Position(Ring.FOREST, randZone[i + j] );
            while ( _.find(this.monsters, (m: Monster) => m.getPosition().isEqual(p) ) ) {
                j++;
                p = new Position(Ring.FOREST, randZone[i + j] );
            }
            monster.setPosition(p);
        }
    }

    /**
     * Checks if game is over
     * 
     * @returns {boolean} - true if game is over, false if game is not over
     * @memberof GameState
     */
    public isGameOver(): boolean {
        return this.loss || this.win;
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
            let killed: boolean = monster.moveForward(this.towers, this.monsters);
        });
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
            player.addCard(this.drawCard());
        }

        player.resetTurn();
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
        if (this.hasStarted() && _.isEqual(this.currentTurn().showPlayerID(), userName)) {
            this.moveAllMonsters();

            let standingTowers = _.filter(this.towers, (t: Tower) => t.isStanding());
            if ( _.isEqual( standingTowers.length, 0) ) {
               this.loss = true;
	   //bug #1: Cannot lose game.
            } else {
               this.loss = false;
            }

            this.drawMonsters();

            this.nextTurn();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Discards a card from a players hand and draws a new one
     * 
     * @param {string} playerName - name of player that wants to discard
     * @param {number} cardIndex - index of card to discard 
     * @returns {Card} - the card that was added to the players hand or null
     * @memberof GameState
     */
    public discard(playerName: string, cardIndex: number ): Card {
        let player: Player = this.currentTurn();
        if ( _.isEqual( player.showPlayerID(), playerName ) && !this.isGameOver()) {
            let result: boolean = player.discard( cardIndex );
            if ( result ) {
                let card = this.drawCard();
                player.addCard( card );
                return card;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * Converts GameState object into a string that can be stored in a database
     * 
     * @returns {string}    - string representation of game state
     * @memberof GameState
     */
    public toString(): string {
        let converter = new JsonConvert();
        let json = converter.serialize(this);
        return JSON.stringify(json);
    }
}
