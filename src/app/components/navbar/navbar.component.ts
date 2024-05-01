import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/firebase-auth/auth.service';
import { Usuario } from '../../classes/usuario';
import { FirestoreUsuariosService } from '../../services/firebase-firestore/firestore-usuarios.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit{
  isLoggedIn!: boolean;
  usuarioActual: any;
  yaHayDatos: boolean = false;

  constructor(private authService: AuthService, private usuariosService: FirestoreUsuariosService) { }

  async ngOnInit(): Promise<void> {
    this.authService.user$.subscribe(async isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.yaHayDatos = isLoggedIn;

      if (this.isLoggedIn) { // Si está logeado, pido su correo y así obtengo todos sus datos
        const correo = this.authService.getCurrentUserEmail();

        console.log('Estoy en el navbar y el correo que me llegó es:' + correo);

        setTimeout(() => {
          this.usuarioActual = this.usuariosService.getUsuarioPorCorreo(correo!);
        }, 100);

        if (this.usuarioActual instanceof Usuario) this.yaHayDatos = true;
      }
    });
  }

  cerrarSesion() {
    this.authService.logout();
  }
}