import { Component } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { emailValidator, minLengthValidator, userValidator } from '../../validations/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule, NgClass],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  correo: string = '';
  clave: string = '';
  nombreUsuario: string = '';
  mensaje: string = 'Bienvenido, para acceder a la Sala de Juegos tenés que crearte una cuenta';
  error: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Forma de hacerlo con Async (recibiendo promesas de mi servicio AuthService)
  async registrar() {
    this.error = true;

    if (!this.correo || !this.clave || !this.nombreUsuario) {
      this.mensaje = 'Tenés que completar todos los campos'
      return;
    } 
    
    if (!emailValidator(this.correo)) {
      this.mensaje = 'Ese correo no es válido';
      return;
    } else if (!minLengthValidator(this.clave, 6)) {
      this.mensaje = 'La contraseña debe tener mínimo 6 caracteres';
      return;
    } else if (!userValidator(this.nombreUsuario)) {
      this.mensaje = 'Ese nombre de usuario no es válido';
      return;
    } else {
      this.error = false;

      try {
        await this.authService.register(this.correo, this.clave);
        console.log('Usuario registrado correctamente');
        this.error = false;
        this.correo = '';
        this.clave = '';
        this.nombreUsuario = '';
        this.router.navigate(['/home']);
      } catch (error: any) {
        this.error = true;
        if (error && error.code) { // Verifico que error no sea nulo y que contiene a 'code'
          if (error.code === 'auth/email-already-in-use') {
              console.log('Error al registrar usuario:', error);
              this.mensaje = 'El correo ya está siendo utilizado por otro usuario';
          } else {
              this.mensaje = 'Error al registrar usuario';
          }
        } else {
            console.error('Error desconocido al registrar usuario:', error);
        }
      }
    }
  }

  /*  // Con el suscribe. Esto sirve cuando recibo un Observable desde Auth
      // Es preferible hacerlo con promesas, Async y Await. Para más sencillez
  registrar() {
    this.error = true;

    if (!this.correo || !this.clave || !this.nombreUsuario) {
      this.mensaje = 'Tenés que completar todos los campos'
      return;
    } 
    
    if (!emailValidator(this.correo)) {
      this.mensaje = 'Ese correo no es válido';
      return;
    } else if (!minLengthValidator(this.clave, 6)) {
      this.mensaje = 'La contraseña debe tener mínimo 6 caracteres';
      return;
    } else if (!userValidator(this.nombreUsuario)) {
      this.mensaje = 'Ese nombre de usuario no es válido';
      return;
    } else {
      this.error = false;

      this.authService.register(this.correo, this.clave)
      .subscribe(
        () => {
          console.log('Usuario registrado correctamente');

          this.error = false;
          this.correo = '';
          this.clave = '';
          this.nombreUsuario = '';

          this.router.navigate(['/home']);
        },
        error => {
          console.log('Error al registrar usuario:', error);

          if (error.code === 'auth/email-already-in-use') {
            this.mensaje = 'El correo ya está siendo utilizado por otro usuario';
          } else {
            this.mensaje = 'Error al registrar usuario';
          }

          this.error = true;
        }
      );
    }
  }*/
}