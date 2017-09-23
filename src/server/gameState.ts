
export class GameState {

    private sessionID: string;
    private monster: any;
    private users: any;

    constructor() {

        this.sessionID = '123';
        this.monster = '';
        this.users = '';

    }

    public setSessionID(sessionid: string): void {
        this.sessionID = sessionid;
    }

    public toString(): string {
        return JSON.stringify(this);
    }

}
