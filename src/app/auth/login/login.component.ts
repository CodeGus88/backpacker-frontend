import { Component } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Login } from '../models/login';
// import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
  ) {

    this.login = new Login();
    this.errorMessage = '';
  }

  onLogin(): void {
    this.authService.login(this.login).subscribe({
      next: data =>{
        this.tokenService.setToken(data.token);
        // this.toast.success(`Conectando...`, "SESIÓN");
        this.snackBar.open("Conectando...", 'SESIÓN', {duration: 3000});
        setTimeout(() =>
          {
            window.location.reload()
            this.route.navigate(['/']);
            // this.toast.success(`Bienvenido ${this.tokenService.getUsername()}...`, "Conectado");
            this.snackBar.open(`Bienvenido ${this.tokenService.getUsername()}...`, 'Conectado', {duration: 3000});
          }, 1500
        );
       
      },
      error: error =>{
        this.errorMessage = error.error.message;
        // this.toast.error(this.errorMessage, "ERROR");
        this.snackBar.open(this.errorMessage, 'ERROR', {duration: 3000});
      }
    });
  }

}
