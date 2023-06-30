export class SessionData{
    username: string | null;
    isLogged: boolean;

    constructor(){
        this.username = '';
        this.isLogged = false;
    }
}