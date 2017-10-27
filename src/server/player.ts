import { JsonConvert, JsonObject, JsonProperty,  } from 'json2typescript';
import * as _ from 'lodash';
import { Card } from './deck/card';

@JsonObject
export class Player {

    // maximum number of cards a player can discard in a turn
    /**
     * Bug No.6: Player can only discard one card instead of 2
     * original code: 
     * public static readonly MAX_DISCARD: number = 2;
     */
    public static readonly MAX_DISCARD: number = 1;
    /**
     * Bug No.6 ends here
     */

    @JsonProperty('userid', String)
    public userid: string = '';

    @JsonProperty('cards', [Card])
    private cards: Card[] = [];

    @JsonProperty('numCards', Number)
    private numCards: number = 0;

    @JsonProperty('timesDiscarded', Number)
    private timesDiscarded: number = 0;

    constructor(userid: string) {
        this.userid = userid; 
        this.cards = new Array();
        this.numCards = 0;
        this.timesDiscarded = 0;
    }

    /**
     * Writes over the players existing hand with a new array of cards, should probably only be
     * used when parsing the game state.
     * 
     * @param {Card[]} cards
     * @memberof Player
     */
    public assignHand(cards: Card[]) {
        this.cards = cards;
    }

    /**
     * Add specific cards to this player
     * 
     * @returns {boolean} 
     */
    public addCard(card: Card): boolean {
        this.numCards++;
        this.cards.push(card);
        return false; 
    }

    /**
     * Player play cards
     * 
     * @returns [card]
     */
    public playCard(cardIndex: number): boolean {
        let cardsNotPlayed: Card[] = [];
        let played: boolean = false;

        if ( cardIndex > 7 || cardIndex < 0) {
            return played;
        } else {
            for (let i = 0; i < this.cards.length; i++) {
                if ( i !== cardIndex ) {
                    cardsNotPlayed.push( this.cards[i] );
                }
            }
            this.cards = cardsNotPlayed;
            played = true;
        }
        
        this.numCards--;
        return played; 
    }

    /**
     * Discards the card at cardIndex from the players hand, allows the player to discard
     * up to MAX_DISCARD times
     * 
     * @param {number} cardIndex - index of card to discard
     * @returns {boolean} 
     * @memberof Player
     */
    public discard(cardIndex: number): boolean {
        if ( cardIndex < 7 && cardIndex >= 0 && this.timesDiscarded < Player.MAX_DISCARD) {
            this.cards = _.filter(this.cards, (card: Card, index: number) => !_.isEqual(cardIndex, index) );
            this.timesDiscarded++;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Resets the player's turn, should be called at the begining
     * 
     * @memberof Player
     */
    public resetTurn(): void {
        this.timesDiscarded = 0;
    }

    /**
     * Return all cards this player has
     * 
     * @returns [card]
     */
    public showCards(): Card[] {
        return this.cards; 
    }

    public showPlayerID(): string {
        return this.userid; 
    }
}
