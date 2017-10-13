import { JsonConvert, JsonObject, JsonProperty,  } from 'json2typescript';
import * as _ from 'lodash';
import { Card } from './deck/card';

@JsonObject
export class Player {

    @JsonProperty('userid', String)
    public userid: string = '';

    @JsonProperty('cards', [Card])
    private cards: Card[] = [];

    @JsonProperty('numCards', Number)
    private numCards: number = 0;

    constructor(userid: string) {
        this.userid = userid; 
        this.cards = [];
        this.numCards = 0;
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
    public addCard(card: Card): void {
        this.cards.push(card);
    }

    /**
     * Discard the specific card
     * 
     * @returns {boolean} 
     */
	 
	 //pretty sure we're not using this function anymore. Discarding isn't a thing.
	 //also, like 70% sure this wouldn't work regardless with how the rest of our code is set up.
    public discardCard(cardID: string): boolean {
        this.numCards--;
        return false; 
    }

    /**
     * Player play cards
     * 
     * @returns [card]
     */
    public playCards(cardID: string[]): boolean {
        this.numCards = this.numCards - cardID.length;
        return false; 
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
