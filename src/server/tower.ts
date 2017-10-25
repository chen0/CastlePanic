import { JsonObject, JsonProperty } from 'json2typescript';
import * as _ from 'lodash';
import { Position, Ring } from './position';

@JsonObject
export class Tower {
    // maximum health a Tower can have. 1 for a tower, 1 for a wall, 1 for a fortify token.
    public static readonly maxHealth: number = 3;

    /**
     * Creates all the towers needed for the game and initializes them in the correct positions
     * 
     * @static
     * @returns {Tower[]} - creates an Array of Towers for the game
     * @memberof Tower
     */
    public static createTowers(): Tower[] {
        let towers: Tower[] = [];
        for (let i = 0; i < 5; i++) {
            let p = new Position(Ring.CASTLE, i + 1);
            let t = new Tower(p, 2);
			if(i === 0){
				health = 4;
			}
            towers.push( t );
        }
        return towers;
    }

    @JsonProperty('health', Number)
    private health: number;
    @JsonProperty('position', Position)
    private position: Position;

    /**
     * Creates a Tower at a position on the board with a set amount of health
     * @param {Position} position 
     * @param {number} health 
     * @memberof Tower
     */
    constructor(position: Position, health: number) {
        this.health = health;
        this.position = position;
    }

    /**
     * Does 1 point of damage to a tower, essentially removing a fortify token, wall, or destroying the tower.
     * 
     * @returns {boolean}  - True if hit destroyed the tower, false if tower is still standing
     * @memberof Tower
     */
    public hit(): boolean {
        this.health--;
        return !this.isStanding();
    }

    /**
     * Destroys the tower regardless of health
     * 
     * @memberof Tower
     */
    public destroy() {
        this.health = 0;
    }

    /**
     * Fortifies a Tower by adding 1 health. If health is already 0 or health = maxHealth the tower cannot be fortified.
     * 
     * @returns {boolean} - True if tower was fortified, false if tower could not be fortified
     * @memberof Tower
     */
    public fortify(): boolean {
        if ( this.isStanding() && this.health < Tower.maxHealth) {
            this.health++;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Gets the remaining health of the tower.
     * 
     * @returns {number} 
     * @memberof Tower
     */
    public getHealth(): number {
        return this.health;
    }

    /**
     * Gets a copy of the tower's position
     * 
     * @returns {Position} 
     * @memberof Tower
     */
    public getPosition(): Position {
        return _.clone(this.position);
    }

    /**
     * Checks if tower is still standing.
     * 
     * @returns {boolean} - True if tower is still standing, false if tower has fallen
     * @memberof Tower
     */
    public isStanding(): boolean {
        return this.health > 0;
    }
}
