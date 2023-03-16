import { Injectable } from '@angular/core';

// Valores almaenados en el navegador
const TOKEN_KEY = 'Authtoken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string>;

  constructor() {
    this.roles = [];
  }

  public setToken(token: string): void{
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string{
    return window.sessionStorage.getItem(TOKEN_KEY)??'';
  }

  public setUserName(username: string): void{
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, username);
  }

  public getUserName(): string{
    return window.sessionStorage.getItem(USERNAME_KEY)??'';
  }

  public setAuthorities(authorities: string[]): void {
     window.sessionStorage.removeItem(AUTHORITIES_KEY);
     window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[]{
    this.roles = [];
    if(sessionStorage.getItem(AUTHORITIES_KEY)){
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)??'[]').forEach(
        (authority: string) => {
          this.roles.push(authority);
        }
      );
    }
    return this.roles;
  }

  public logout(): void {
    window.sessionStorage.clear();
  }

}
