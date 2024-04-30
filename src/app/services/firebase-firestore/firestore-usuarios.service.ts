import { Injectable } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreUsuariosService {
  private PATH = 'usuarios';
  listaUsuarios: Usuario[] = [];

  constructor(private firestore: Firestore) {
    this.cargar();
    console.log(`La lista de usuarios hecha en el constructor: ${this.listaUsuarios}`);

  }

  guardar(usuario: Usuario) {
    try {
      const col = collection(this.firestore, this.PATH);
      addDoc(col, {
        correo: usuario.correo,
        nombreUsuario: usuario.nombreUsuario,
        edad: usuario.edad,
        sexo: usuario.sexo
      });

      this.cargar(); // Actualizo la lista apenas guardo un usuario nuevo

      console.log(`La lista de usuarios después de guardar este ultimo: ${this.listaUsuarios}`);
    } catch(error) {
      console.log(error);
    }
  }

  getUsuarioPorCorreo(correo: string): Usuario | undefined {
    return this.listaUsuarios.find(usuario => usuario.correo === correo);
  }

  cargar() {
    const col = collection(this.firestore, this.PATH);
    const observable = collectionData(col);
  
    observable.subscribe((documentos => {
      this.listaUsuarios = documentos.map(doc => this.convertirAUsuario(doc));
    }));
  }
  
  convertirAUsuario(doc: any): Usuario {
    const data = doc as any; // Acceder directamente a los datos del documento
    // Aquí deberías validar que los datos del documento sean válidos antes de asignarlos a un objeto Usuario
    return new Usuario(
      data.correo,
      '', // La clave no la guardo en la BD
      data.nombreUsuario,
      data.sexo,
      data.edad
    );
  }

    /*
  traer() {
    const col = collection(this.firestore, this.PATH);
    const observable = collectionData(col);

    observable.subscribe((respuesta => {
      console.log((respuesta));
    }));*/
}