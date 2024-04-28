import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  mostrarAutenticacion = true;

  constructor(private authService: AuthService) {
    this.mostrarAutenticacion = !this.authService.estaAutenticado();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.mostrarAutenticacion = true;
  }
}