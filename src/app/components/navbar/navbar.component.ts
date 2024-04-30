import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/firebase-auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit{
  isLoggedIn!: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  cerrarSesion() {
    this.authService.logout();
  }

  mostrar() {
    console.log(`En el navbar, la variable de logeo es: ${this.isLoggedIn}`)
  }
}