import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/firebase-auth/auth.service';
import { FirestoreUsuariosService } from '../../services/firebase-firestore/firestore-usuarios.service';
import { Usuario } from '../../classes/usuario';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  isLoggedIn = false;
  usuarioActual: any;

  constructor(private authService: AuthService, private usuariosService: FirestoreUsuariosService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.authService.user$.subscribe(async isLoggedIn => {
      this.isLoggedIn = isLoggedIn; // Actualizo el valor de 'está Logeado'

      if (isLoggedIn) { // Si está logeado, pido su correo y así obtengo todos sus datos
        const correo = this.authService.getCurrentUserEmail();
        this.usuarioActual = this.usuariosService.getUsuarioPorCorreo(correo!);

        console.log('Estamos dentro del HOME y los datos del usuario actual son:');
        console.log(this.usuarioActual);
      }
    });
  }
}