import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRequest } from '../models/user-request';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  newUser: UserRequest;
  passwordConfirmation?: String;
  errorMessage?: String;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toast: ToastrService
    ) {
    this.newUser = new UserRequest();
    this.newUser.roles = ['user'];
  }

  onRegister() {
    if (this.newUser.password == this.passwordConfirmation) {
      this.authService.register(this.newUser).subscribe(
        data => {
          console.log(data);
          this.toast.success(data.message, "SUCCESS");
          this.router.navigate(['/login']);
        },
        e => {
          console.log(e);
          if (e.error) {
            this.errorMessage = '';
            e.error.forEach((item?: any) => {
              const expresionForName = /^\w+\.name$/gi;
              const expresionForUsername = /^\w*username$/gi;
              const expresionForEmail = /^\w*email$/gi;
              const expresionForPassword = /^\w*password$/gi;
              this.errorMessage += `
              <p>${item.title
                .replace(expresionForName, 'Nombre')
                .replace(expresionForUsername, "Nombre de usuario")
                .replace(expresionForEmail, 'Email')
                .replace(expresionForPassword, 'Contraseña')
              }:
              ${item.message}</p>`;
            });
          }else{
            this.errorMessage = "Status error: " + e.status;
          }
        }
      );
    } else {
      this.errorMessage = "Las contraseñas no coinciden";
    }
  }

}
