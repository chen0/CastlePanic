
export class GameState {

	sessionID: string;
	monster: any;
	users: any;

	constructor() {

		this.sessionID = "123"; 
		this.monster = ""; 
		this.users = "";

	}

	public setSessionID(sessionid: string): void {
		this.sessionID = sessionid;
	}

	public toString(): string {
		return JSON.stringify(this);
	}

}
