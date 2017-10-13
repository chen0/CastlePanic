import { JsonObject, JsonProperty } from 'json2typescript';
import * as _ from 'lodash';

export namespace Ring {
    export let CASTLE = 0;
    export let SWORDSMAN = 1;
    export let KNIGHT = 2;
    export let ARCHER = 3;
    export let FOREST = 4;
    export let OFF_BOARD = 5;
}

export namespace Color {
    export let RED = 0;
    export let GREEN = 1;
    export let BLUE = 2;
}

@JsonObject
export class Position {

    @JsonProperty('ring', Number)
    private ring: number;

    // zone is on a scale 1 - 6 to represent the different zones on the board
    @JsonProperty('zone', Number)
    private zone: number;

    constructor(ring: number, zone: number) {
        this.setPosition(ring, zone);
    }

    /**
     * Sets the position on the board
     * 
     * @param {number} ring 
     * @param {number} zone 
     * @memberof Position
     */
    public setPosition(ring: number, zone: number) {
        this.ring = ring;
        this.zone = zone;
    }

    /**
     * Gets the ring of the position
     * 
     * @returns {number} 
     * @memberof Position
     */
    public getRing(): number {
        return this.ring;
    }

    /**
     * Gets the zone on the board. The zones are the numbers that go around the board labeling the different sections.
     * 
     * @returns {number} 
     * @memberof Position
     */
    public getZone(): number {
        return this.zone;
    }

    /**
     * Creates a new position that is rotated around the board in the clockwise direction.
     * Does not modify the current position
     * 
     * @returns {Position}          - new rotated position.
     * @memberof Position
     */
    public clockwise(): Position {
        // newZone = ( (zone - 1 + 1) % 6) + 1
        // subtract 1 to translate to scale 0-5
        // add 1 to move clockwise
        // mod 6 to prevent values higher than 5
        // add 1 to translate to scale 1-6
        let newZone = (this.getZone() % 6) + 1;
        return new Position(this.ring, newZone);
    }

    /**
     * Creates a new position that is one spot forward or clockwise.
     * 
     * @returns {Position} 
     * @memberof Position
     */
    public nextPosition(): Position {
        if ( _.isEqual(this.ring, Ring.CASTLE) ) {
            return this.clockwise();
        } else {
            return new Position( this.ring - 1, this.zone);
        }
    }

    /**
     * Checks if two positions are the same position on the board.
     * 
     * @param {Position} position     - True if positions are equal, False if they are not
     * @returns {boolean} 
     * @memberof Position
     */
    public isEqual(position: Position): boolean {
        return _.isEqual(this.ring, position.getRing()) && _.isEqual(this.zone, position.getZone() );
    }

    /**
     * Determines the color of the position
     * 
     * @returns {number}  - Color encoded as a number, reference the color namespace above
     * @memberof Position
     */
    public getColor(): number {
        switch ( this.zone) {
            case 1:
            case 2:
                return Color.RED;
            case 3:
            case 4:
                return Color.GREEN;
            case 5:
            case 6:
                return Color.BLUE;
            default:
                return null;
        }
    }
}
