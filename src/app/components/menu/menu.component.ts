import { Component } from '@angular/core';
import { TokenService } from '../../auth/services/token.service';
import { Router } from '@angular/router';
import { SessionData } from 'src/app/dtos/session-data.dt';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  protected isLogged: boolean = false;

  static sessionData: SessionData = new SessionData();
  sessionData: SessionData;

  constructor(
    private tokenService: TokenService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ){
      this.sessionData = MenuComponent.sessionData;
  }

  ngOnInit(){
    this.checkSession();
    this.isLogged = this.tokenService.isLogged();
    console.log("isLogged", this.isLogged);
  }

  onLogout(){
    this.tokenService.logout();
    // this.toastr.info(`Cerrando sesión...`, "Cerrar");
    this.snackBar.open("Cerrando sesión...", 'OK', {
      duration: 3000
    });
    this.checkSession();
    this.router.navigate(['/login']);
  }

  public checkSession(){
      this.sessionData.isLogged = this.tokenService.isLogged();
      this.sessionData.username = this.tokenService.getUsername();
      if(this.sessionData.isLogged && document.location.href.includes("/login"))
        this.router.navigate(['/']);
      console.log(this.sessionData);
  }

  public redirectTo(url: string){
    this.router.navigate([url]);
  }

}
