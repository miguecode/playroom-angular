import { Component } from '@angular/core';
import { Usuario } from '../../../classes/usuario';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/firebase-auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { edadValidator, emailValidator, minLengthValidator, sexoValidator, userValidator } from '../../../validations/forms';
import { FirestoreUsuariosService } from '../../../services/firebase-firestore/firestore-usuarios.service';
import { FirestoreLogsService } from '../../../services/firebase-firestore/firestore-logs.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule, NgClass],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuarioCreado = new Usuario('', '', '', 'sin-especificar', 18);
  mensaje: string = 'Bienvenido, para acceder a la Sala de Juegos tenés que crearte una cuenta';
  error: boolean = false;

  constructor(private authService: AuthService, private firestoreService: FirestoreUsuariosService,
     private router: Router, private logsService: FirestoreLogsService) {
  }

  async registrar() {
    this.error = true;

    if (this.validarCampos(this.usuarioCreado.correo, this.usuarioCreado.clave,
      this.usuarioCreado.nombreUsuario, this.usuarioCreado.edad, this.usuarioCreado.sexo)) {
      try {
        await this.authService.register(this.usuarioCreado.correo, this.usuarioCreado.clave);
        console.log('Usuario registrado correctamente');
        
        this.firestoreService.guardar(this.usuarioCreado); // Lo guardo en la base de datos
        this.logsService.crear(this.usuarioCreado.nombreUsuario);
        
        this.vaciarCampos();
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

  validarCampos(correo: string, clave: string, nombreUsuario: string, edad: number, sexo: string): boolean {
    if (!this.usuarioCreado.correo || !this.usuarioCreado.clave || !this.usuarioCreado.nombreUsuario
      || !this.usuarioCreado.edad || !this.usuarioCreado.sexo ) {
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
    if (!userValidator(nombreUsuario)) {
      this.mensaje = 'Ese nombre de usuario no es válido';
      return false;
    } 
    if (!edadValidator(edad, 5, 120)) {
      this.mensaje = 'La edad debe ser entre 5 y 120 años';
      return false;
    } 
    if (!sexoValidator(sexo)) {
      this.mensaje = "El sexo puede ser 'Masculino', 'Femenino' o 'Sin Especificar'";
      return false;
    }

    return true;
  }

  vaciarCampos(): void {
    this.error = false;
    this.usuarioCreado.correo = '';
    this.usuarioCreado.clave = '';
    this.usuarioCreado.nombreUsuario = '';
    this.usuarioCreado.edad = 18;
    this.usuarioCreado.sexo = '';
  }
}