import { Component, Input } from '@angular/core';
import { TokenService } from '../../auth/services/token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionData } from 'src/app/dtos/session-data.dt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  static sessionData: SessionData = new SessionData();
  sessionData: SessionData;

  constructor(
    private tokenService: TokenService, 
    private router: Router, 
    private toastr: ToastrService
  ){
      this.sessionData = MenuComponent.sessionData;
  }

  ngOnInit(){
    this.checkSession();
  }

  onLogout(){
    this.tokenService.logout();
    this.toastr.info(`Cerrando sesión...`, "Cerrar");
    this.checkSession();
    this.router.navigate(['/login']);
  }

  public checkSession(){
      console.log("navegación actual", document.location.href);
      this.sessionData.isLogged = this.tokenService.isLogged();
      this.sessionData.username = this.tokenService.getUsername();
      if(this.sessionData.isLogged && document.location.href.includes("/login"))
      this.router.navigate(['/']);
      console.log(this.sessionData);
  }

}
