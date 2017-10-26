import * as _ from 'lodash';
import { Goblin } from './goblin';
import { Monster } from './monster';
import { Orc } from './orc';
import { Troll } from './troll';

export namespace MonsterToolkit {

    /**
     * Instantiates an Array of monsters and shuffles them. Currently only contains 27/31 monsters and does not
     * contain any special tokens yet
     * 
     * @export
     * @returns {Monster[]} 
     */
    export function getMonsters(): Monster[] {
        let monsters: Monster[] = [];

        // create all the goblins
        // added 1 more goblin
        for (let i = 0; i < 9; i++) {
            monsters.push(new Goblin());
        }

        // create all the Orcs
        for (let i = 0; i < 6; i++) {
            monsters.push(new Orc());
        }

        // create all the Trolls
        for (let i = 0; i < 5; i++) {
            monsters.push(new Troll());
        }

        return _.shuffle(monsters);
    }

    /**
     * Converts the Types of an Array of monsters into their appropriate child types.
     * This is very important because without it function overriding for these types
     * will not work after the object is stored in the database.
     * 
     * @export
     * @param {Monster[]} monsters 
     * @returns {Monster[]} 
     */
    export function assignMonsterTypes(monsters: Monster[]): Monster[] {
        let typedMonsters = [];
        for (let monster of monsters) {
            let typed: any;
            switch (monster.type) {
                case 'Goblin':
                    typed = new Goblin();
                    break;
                case 'Troll':
                    typed = new Troll();
                    break;
                case 'Orc':
                    typed = new Orc();
                    break;
                default:
                    console.error(`Unrecognized Monster Type: ${monster.type}`);
                    break;
            }

            // assigns properties of monster to typed
            _.assign(typed, monster);
            typedMonsters.push(typed);
        }
        return typedMonsters;
    }

}
