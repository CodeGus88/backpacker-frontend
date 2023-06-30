import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { UserRequest } from '../models/user-request';
import { JwtDto } from '../models/jwt-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string;

  constructor(private httpClient: HttpClient) {
    this.url = environment.apiUrl + '/auth';
  }

  public register(request: UserRequest): Observable<any> {
    console.log(request);
    return this.httpClient.post<any>(`${this.url}/register`, request);

  }

  public login(login: Login): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(`${this.url}/login`, login);
  }

  public refresh(dto: JwtDto): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.url + '/refresh', dto);
  }

}
