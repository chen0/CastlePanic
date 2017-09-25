import { JsonObject, JsonProperty } from 'json2typescript';

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
