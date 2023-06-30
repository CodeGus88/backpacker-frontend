import { Component } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Route, Router } from '@angular/router';
import { Login } from '../models/login';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  login: Login

  errorMessage: string;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private route: Router,
    private toast: ToastrService
  ) {

    this.login = new Login();
    this.errorMessage = '';
  }

  onLogin(): void {
    this.authService.login(this.login).subscribe({
      next: data =>{
        this.tokenService.setToken(data.token);
        this.toast.success(`Conectando...`, "SESIÓN");
        setTimeout(() =>
          {
            window.location.reload()
            this.route.navigate(['/']);
            this.toast.success(`Bienvenido ${this.tokenService.getUsername()}...`, "Conectado");
          }, 1500
        );
       
      },
      error: error =>{
        this.errorMessage = error.error.message;
        this.toast.error(this.errorMessage, "ERROR");
      }
    });
  }

}
