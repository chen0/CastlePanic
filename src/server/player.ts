import { JsonConvert, JsonObject, JsonProperty,  } from 'json2typescript';
import * as _ from 'lodash';

@JsonObject
export class Player {

    @JsonProperty('userid', String)
    public userid: string = '';

	@JsonProperty('cards', [String])
	private cards: string[] = [];

	@JsonProperty('numCards', Number)
	private numCards: number = 0;

	constructor(userid: string) {
		this.userid = userid; 
		this.cards = new Array();
		this.numCards = 0;
	}

	/**
	 * Add specific cards to this player
	 * 
	 * @returns {boolean} 
	 * still need to modify: add card class and change string[] to card[]
	 */
	public addCard(cardID: string[]): boolean {
		this.numCards = this.numCards + cardID.length;
		return false; 
	}

	/**
	 * Discard the specific card
	 * 
	 * @returns {boolean} 
	 */
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
	public showCards(): string[] {
		return this.cards; 
	}


	public showPlayerID(): string {
		return this.userid; 
	}
}