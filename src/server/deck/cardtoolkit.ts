import * as _ from 'lodash';
import { Card } from './card';
import { GreenSwordsman } from './greenswordsman';
import { RedSwordsman } from './redswordsman';
import { BlueSwordsman } from './blueswordsman';
import { GreenArcher } from './greenarcher';
import { BlueArcher } from './bluearcher';
import { RedArcher } from './redarcher';
import { BlueKnight } from './blueknight';
import { GreenKnight } from './greenknight';
import { RedKnight } from './redknight';


export namespace CardToolkit {

    /** Taken directly from the other toolkit shamelessly
     * Instantiates an Array of cards and shuffles them. Currently only contains 54 cards and does not
     * contain any special tokens yet
     * 
     * @export
     * @returns {Card[]} 
     */
    export function getCards(): Card[] {
        let cards: Card[] = [];
//		let drawnCards: Card[] = [];

        // create all the GreenSwordsman
        for (let i = 0; i < 6; i++) {
            cards.push(new GreenSwordsman());
        }


        // create all the RedSwordsman
        for (let i = 0; i < 6; i++) {
            cards.push(new RedSwordsman());
        }
		
		
		
        // create all the BlueSwordsman
        for (let i = 0; i < 6; i++) {
            cards.push(new BlueSwordsman());
        }
		
		
		
        // create all the GreenArcher
        for (let i = 0; i < 6; i++) {
            cards.push(new GreenArcher());
        }
		
		// create all the BlueArcher
        for (let i = 0; i < 6; i++) {
            cards.push(new BlueArcher());
        }
		
		// create all the RedArcher
        for (let i = 0; i < 6; i++) {
            cards.push(new RedArcher());
        }
		// create all the BlueKnight
        for (let i = 0; i < 6; i++) {
            cards.push(new BlueKnight());
        }

		// create all the GreenKnight
        for (let i = 0; i < 6; i++) {
            cards.push(new GreenKnight());
        }
		// create all the RedKnight
        for (let i = 0; i < 6; i++) {
            cards.push(new RedKnight());
        }

		
        return _.shuffle(cards);
    }

    /**
     * Converts the Types of an Array of cards into their appropriate child types.
     * This is very important because without it function overriding for these types
     * will not work after the object is stored in the database.
     * 
     * @export
     * @param {Card[]} cards 
     * @returns {Card[]} 
     */
    export function assignCardTypes(cards: Card[]): Card[] {
        let typedCards = [];
        for (let card of cards) {
            let typed: any;
            switch (card.type) {
                case 'GreenSwordsman':
                    typed = new GreenSwordsman();
                    break;
                case 'RedSwordsman':
                    typed = new RedSwordsman();
                    break;
                case 'BlueSwordsman':
                    typed = new BlueSwordsman();
					break;
				case 'GreenArcher':
                    typed = new GreenArcher();
                    break;
                case 'BlueArcher':
                    typed = new BlueArcher();
                    break;
                case 'RedArcher':
                    typed = new RedArcher();
					break;
				case 'BlueKnight':
                    typed = new BlueKnight();
                    break;
                case 'GreenKnight':
                    typed = new GreenKnight();
                    break;
                case 'RedKnight':
                    typed = new RedKnight();
					break;
                default:
                    console.error(`Unrecognized Card Type: ${card.type}`);
                    break;
            }

            // assigns properties of card to typed
            _.assign(typed, card);
            typedCards.push(typed);
        }
        return typedCards;
    }
/*	This is my idea for drawing cards/discarding them. I am bad at coding and also don't know how the player class works (as it is not complete yet), but here is an idea how to do it
	ALSO NOTE THAT I AM UNSURE WHERE THE CARD ARRAY IS BEING STORED. I am unsure where to pop from, so I'm just doing pop.card(). 
	Obviously we need to build a pop function in the place where the array of cards is being stored.
	
	Actually, I had to rewrite this function. We need the player to be the one to draw the card now that I've thought about it. Literally all I can do here is pop the card off the top and return it.
	
	
	export function drawCards(cards: Card[]): Card {
		return pop.card();
	}
	
	This is a hella rudimentary function that probably won't work. This is just an idea on how to handle the idea of a discard pile
	NOTE: We can easily do this by just reshuffling the standard deck each time we run out. Yeah, we'll have issues with cards being duplicated but w/e. 
	Up to the group how we handle it.
	All this would do would be to push the discarded card to the top (0th position) of the discard array.
	I'm not making the function to reshuffle the discard pile until we know we need it for sure.
	
	export function discardPile(card: Card[]): Card[] {
	
	}
	
	
*/

	export function drawCards(cards:Card[]): Card{
//		let cardDrawn: Card = undefined;
//		cardDrawn = cards.pop();
		return cards.shift();
	}
	//actually, you can use the above function to add cards drawn to the discard pile, too.
	//just call cardToAdd = deck.push(deck.drawCards); where cardToAdd is a card that is being placed in the player's hand.
	
	
	//If you *need* to have a different (altho entirely redundant) function to add cards to a discard array, here it
	//is. Just call this function and push the cards onto the top of the discardCards array.
	export function discardPile(cards:Card[]): Card{
		return cards.shift();
	}
	
	//This is required to be a different function because it allows the database to keep track of the cards 
	//left in the deck. NOTE THAT THIS SHOULD HONESTLY BE HANDLED IN THE DATABASE ITSELF. Just do the same 
	//thing as here, only with the deck array being popped.
	export function deckReturned(cards:Card[]): Card[]{
		cards.shift();
		return cards;
	}
}
