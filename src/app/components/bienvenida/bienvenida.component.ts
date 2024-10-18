import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/firebase-auth/auth.service';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})
export class BienvenidaComponent {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.authService.user$.subscribe(async isLoggedIn => {
      this.isLoggedIn = isLoggedIn;

      setTimeout(() => {
        if (this.isLoggedIn) {
          this.router.navigate(['/home']);
        }
      }, 100);
    });
  }
}