import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { NewUser } from '../models/new-user';
import { JwtDto } from '../models/jwt-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string;

  constructor(private httpClient: HttpClient) {
    this.url = environment.urlApi;
    console.log(this.url);
  }

  public register(newUser: NewUser): Observable<any>{
    

    return this.httpClient.post<any>(`${this.url}/auth/create`, newUser);

  }

  public login(login: Login): Observable<JwtDto>{

    return this.httpClient.post<JwtDto>(`${this.url}/auth/login`, login);

  }

  
}
