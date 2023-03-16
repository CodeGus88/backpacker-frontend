export class JwtDto {
    token: string;
    type: string;
    username: string;
    authorities: string[]

    constructor(){
        this.token = '';
        this.type = '';
        this.username = '';
        this.authorities = [];
    }

}
