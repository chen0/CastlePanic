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

}
