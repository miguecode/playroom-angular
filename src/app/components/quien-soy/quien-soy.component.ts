import { Component } from '@angular/core';
import { GithubService } from '../../services/API/github.service';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css'
})
export class QuienSoyComponent {
  nombre: string = '';
  nombreUsuario: string = '';
  ubicacion: string = '';
  biografia: string = '';
  usuarioTwitter: string = '';
  cantidadRepositorios: number = 0;
  fechaCreacion: string = '';

  constructor(private apiService: GithubService) {  
    this.apiService.getGithubData().subscribe((data: any) => {
      this.nombre = data.name;
      this.nombreUsuario = data.login;
      this.ubicacion = data.location;
      this.biografia = data.bio;
      this.cantidadRepositorios = data.public_repos;
      this.usuarioTwitter = data.twitter_username;
      this.fechaCreacion = data.created_at;

      console.log(data);
    })
  }
}
