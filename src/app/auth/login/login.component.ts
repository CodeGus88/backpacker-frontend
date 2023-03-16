import { Component } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Login } from '../models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isLogged: boolean;
  isLoginFail: boolean;
  login?: Login;

  username: string;
  password: string;
  roles: string[];

  errorMessage: string;

  constructor(
    private tokenService: TokenService, 
    private authService: AuthService,
    private router: Router
  ){
    this.isLogged = false;
    this.isLoginFail = false;
    this.login = undefined;

    this.username = '';
    this.password = '';
    this.roles = [];

    this.errorMessage = '';
  }

  ngOnInit(){
    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin(): void{
    this.login = new Login(this.username, this.password);
    this.authService.login(this.login).subscribe(
      data => {
        this.isLogged = true;
        this.isLoginFail = false;
        
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.username);
        this.tokenService.setAuthorities(data.authorities);

        this.roles = data.authorities;

        this.router.navigate(['/']);
      },
      error => {
        this.isLogged = false;
        this.isLoginFail = true;
        error.forEach((element: any) => {
          this.errorMessage = element.title + " " + element.message +'\n';
        });
        console.log(this.errorMessage);
        console.log(error);
      }
    );
  }

}
