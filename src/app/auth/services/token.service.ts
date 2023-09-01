import { Injectable } from '@angular/core';
import { EROLE } from '../enums/role.enum';
import { JwtHelperService } from '@auth0/angular-jwt';

// Valores almacenados en el navegador
const TOKEN_KEY = 'Authtoken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string>;

  constructor() {
    this.roles = [];
  }

  public setToken(token: string): void{
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public isLogged(): boolean{
    let token: string | null = this.getToken();
    if(token && token != null && token != '' && token != 'null')
      if(!this.isExpired())
        return true;
    return false;
  }

  public isExpired(): boolean {
    const token = this.getToken();
    const helper = new JwtHelperService();
    return helper.isTokenExpired(token);
  }

  public getUsername(): string | null {
    if(!this.isLogged())
      return null;
    const token = this.getToken();
    const payload = token!.split('.')[1];
    const payloadDecode = window.atob(payload);
    const values = JSON.parse(payloadDecode);
    const username = values.sub;
    return username;
  }

  public hasRole(eRole: EROLE): boolean{
    if(!this.isLogged())
      return false;
    const token = this.getToken();
    const payload  = token!.split('.')[1];
    const payloadDecoded = window.atob(payload);
    const values = JSON.parse(payloadDecoded);
    const roles = values.roles;
    if(roles.indexOf(eRole) < 0)
      return false;
    return true;
  }

  public logout(): void {
    window.localStorage.clear();
  }

}
