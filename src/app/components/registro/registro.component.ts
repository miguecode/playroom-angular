import { Component } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  correo: string = '';
  clave: string = '';
  nombre: string = '';
  edad: number = 0;

  constructor() {}

  registrar() {
    // Obtener la lista de usuarios del LocalStorage
    const usuariosDeLSString: string | null = localStorage.getItem('usuarios');
    const listaDeUsuarios: Usuario[] = usuariosDeLSString ? JSON.parse(usuariosDeLSString) : [];

    // Crear un nuevo usuario con los datos del formulario
    const nuevoUsuario = new Usuario(this.correo, this.clave, this.nombre, this.edad);

    // Verificar si el correo ya está registrado
    const usuarioExistente = listaDeUsuarios.find(u => u.correo === nuevoUsuario.correo);

    if (usuarioExistente) {
      console.log('El correo ya está registrado');
    } else {
      // Agregar el nuevo usuario a la lista
      listaDeUsuarios.push(nuevoUsuario);

      // Actualizar la lista de usuarios en el LocalStorage
      localStorage.setItem('usuarios', JSON.stringify(listaDeUsuarios));

      console.log('Usuario registrado correctamente');
    }

    // Limpiar los campos del formulario después del registro
    this.correo = '';
    this.clave = '';
    this.nombre = '';
    this.edad = 0;
  }
}
