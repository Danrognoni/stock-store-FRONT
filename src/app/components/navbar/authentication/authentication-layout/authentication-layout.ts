import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar-component/navbar-component";
import { RouterOutlet } from "../../../../../../node_modules/@angular/router/types/_router_module-chunk";
import { NavItem } from '../../../../models/nav-item';

@Component({
  selector: 'app-authentication-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './authentication-layout.html',
  styleUrl: './authentication-layout.css',
})
export class AuthenticationLayout {
  menu:NavItem[] = [
      {label: "Iniciar sesión", route:"/inventory-items"},
      {label: "Registrarse", route: "/inventory-items/create"}
  ]
}
