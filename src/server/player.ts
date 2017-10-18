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
        this.cards = new Array();
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

        if ( cardIndex > 5 || cardIndex < 0) {
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
