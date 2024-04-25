import { Component } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  correo: string = '';
  clave: string = '';

  listaDeUsuarios: Usuario[] = [
    new Usuario('junmigue7@gmail.com', 'aaaaaaaa', 'Miguel', 22),
    new Usuario('probando@gmail.com', 'bbbbbbbb', 'Pepe', 15),
  ];
  
  constructor() {
    //localStorage.setItem('usuarios', JSON.stringify(this.listaDeUsuarios));
  }

  ingresar(correo: string, clave: string) {
    const usuariosDeLSString: string | null = localStorage.getItem('usuarios');

    if (usuariosDeLSString !== null) {
      const usuariosDeLS: Usuario[] = JSON.parse(usuariosDeLSString);

      const usuarioExistente = usuariosDeLS.find(u => u.correo === correo && u.clave === clave);
  
      if (usuarioExistente) {
        console.log('Inicio de sesión exitoso');

        this.correo = '';
        this.clave = '';
      } else {
        console.log('Credenciales incorrectas');
      }
    } else {
      console.log('No hay usuarios almacenados en el LocalStorage');
    }
  }
}