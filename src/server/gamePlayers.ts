import { JsonConvert, JsonObject, JsonProperty,  } from 'json2typescript';
import * as _ from 'lodash';

@JsonObject
export class GamePlayers {


	@JsonProperty('sessionid', String)
	private sessionid: string = ''; 

	@JsonProperty('players', [String])
	private players: string[] = [];

	@JsonProperty('owner', String)
	private owner: string;

	@JsonProperty('cards', [String])
	private cards: string[] = [];

	@JsonProperty('owner', Number)
	private numPlayers: number = 0;


	constructor(sessionid: string) {

		this.sessionid = sessionid; 
		this.players = new Array();
		this.owner = "";
		this.cards = new Array();
		this.numPlayers = 0;

	}

	/* add the owner of the game */
	public addOwner(userID: string): void{
		this.owner = userID;
		this.players.push(userID);
	}

	/* return the owner of the game */
	public getOwner(): string {
		return this.owner;
	}

	/* add players to the list */
	public addPlayers(userID: string): void {
		this.players.push(userID);
	}

	/* return all players */
	public getPlayers(): string[] {
		return this.players;
	}

	/**
	 * Get the userid of this turn
	 * 
	 * To be modified
	 */
	public getTurn(): string {
		return this.owner; 
	}

}