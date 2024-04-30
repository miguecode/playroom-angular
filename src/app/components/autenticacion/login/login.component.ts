import { Component } from '@angular/core';
import { Usuario } from '../../../classes/usuario';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/firebase-auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { minLengthValidator, emailValidator } from '../../../validations/forms';
import { NgClass } from '@angular/common';
import { FirestoreLogsService } from '../../../services/firebase-firestore/firestore-logs.service';
import { FirestoreUsuariosService } from '../../../services/firebase-firestore/firestore-usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuarioCreado: Usuario = new Usuario('', '', '', '', 0);
  mensaje: string = 'Bienvenido, para iniciar sesión tenés que ingresar tus datos correctamente';
  error: boolean = false;

  constructor(private authService: AuthService, private router: Router, private usuarioService: FirestoreUsuariosService,
     private logsService: FirestoreLogsService) {}

  async ingresar() {
    this.error = true;

    if (this.validarCampos(this.usuarioCreado.correo, this.usuarioCreado.clave)) {
      try {
        await this.authService.login(this.usuarioCreado.correo, this.usuarioCreado.clave);
        console.log('Inicio de sesión exitoso');
        
        const usuarioDeLista = this.usuarioService.getUsuarioPorCorreo(this.usuarioCreado.correo);
        console.log('Datos del Usuario Recibido:');
        console.log(usuarioDeLista);

        this.logsService.crear(usuarioDeLista?.nombreUsuario);

        this.vaciarCampos();

        this.router.navigate(['/home']);
      } catch (error) {
        this.error = true;
        console.log('Error al iniciar sesión:', error);
        this.mensaje = 'No existe un usuario con ese correo y esa contraseña';
      }
    }
  }

  validarCampos(correo: string, clave: string): boolean {
    if (!this.usuarioCreado.correo || !this.usuarioCreado.clave) {
      this.mensaje = 'Tenés que completar todos los campos';
      return false;
    }
    if (!emailValidator(correo)) {
      this.mensaje = 'Ese correo no es válido';
      return false;
    } 
    if (!minLengthValidator(clave, 6)) {
      this.mensaje = 'La contraseña debe tener mínimo 6 caracteres';
      return false;
    } 

    return true;
  }

  vaciarCampos(): void {
    this.error = false;
    this.usuarioCreado.correo = '';
    this.usuarioCreado.clave = '';
  }

  autocompletarDatos(correo: string, clave: string) {
    this.usuarioCreado.correo = correo;
    this.usuarioCreado.clave = clave;
  }
}