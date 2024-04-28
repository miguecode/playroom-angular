import { Component } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { minLengthValidator, emailValidator } from '../../validations/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  correo: string = '';
  clave: string = '';
  nombreUsuario: string = '';
  usuarioCreado: Usuario = new Usuario('', '', '');
  mensaje: string = 'Bienvenido, para iniciar sesión tenés que ingresar tus datos correctamente';
  error: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}


  // Forma de hacerlo con Async (recibiendo promesas de mi servicio AuthService)
  async ingresar() {
    this.error = true;

    if (!this.correo || !this.clave) {
        this.mensaje = 'Tenés que completar ambos campos';
      return;
    } 
    
    if (!emailValidator(this.correo)) {
      this.mensaje = 'Ese correo no es válido';
      return;

    } else if (!minLengthValidator(this.clave, 6)) {
      this.mensaje = 'La contraseña debe tener mínimo 6 caracteres';
      return;

    } else {
      this.error = false;

      try {
        await this.authService.login(this.correo, this.clave);
        console.log('Inicio de sesión exitoso');
        
        this.usuarioCreado.correo = this.correo;
        this.usuarioCreado.clave = this.clave;
        this.usuarioCreado.nombreUsuario = this.nombreUsuario;
        
        this.error = false;
        this.correo = '';
        this.clave = '';

        this.router.navigate(['/home']);
      } catch (error) {
        this.error = true;
        console.log('Error al iniciar sesión:', error);
        this.mensaje = 'No existe un usuario con ese correo y esa contraseña';
      }
    }
  }


  /*  // Con el suscribe. Esto sirve cuando recibo un Observable desde Auth
      // Es preferible hacerlo con promesas, Async y Await. Para más sencillez
  ingresar() {
    this.error = true;

    if (!this.correo || !this.clave) {
        this.mensaje = 'Tenés que completar ambos campos';
      return;
    } 
    
    if (!emailValidator(this.correo)) {
      this.mensaje = 'Ese correo no es válido';
      return;

    } else if (!minLengthValidator(this.clave, 6)) {
      this.mensaje = 'La contraseña debe tener mínimo 6 caracteres';
      return;

    } else {
      this.error = false;

      this.authService.login(this.correo, this.clave)
      .subscribe(
        () => {
          console.log('Inicio de sesión exitoso');
          
          this.usuarioCreado.correo = this.correo;
          this.usuarioCreado.clave = this.clave;
          this.usuarioCreado.nombreUsuario = this.nombreUsuario;
          
          this.error = false;
          this.correo = '';
          this.clave = '';

          this.router.navigate(['/home']);
        },
        error => {
          this.error = true;

          console.log('Error al iniciar sesión:', error);
          this.mensaje = 'No existe un usuario con ese correo y esa contraseña'
        }
      );
    }
  }*/

  autocompletarDatos(correo: string, clave: string) {
    this.correo = correo;
    this.clave = clave;
  }
}