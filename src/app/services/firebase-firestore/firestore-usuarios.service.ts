import { Injectable } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class FirestoreUsuariosService {
  private PATH = 'usuarios';
  private listaUsuarios: Usuario[] = [];
  
  constructor(private firestore: Firestore) {
    const storedUsuarios = localStorage.getItem('usuarios');
    storedUsuarios? this.listaUsuarios = JSON.parse(storedUsuarios) : this.cargar();
    // Intento cargar la lista de usuarios con el LS y sino hay, lo hago desde la DB
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
      
      this.cargar();
    } catch(error) {
      console.log(error);
    }
  }

  getUsuarioPorCorreo(correo: string): Usuario | undefined {
    return this.listaUsuarios.find(usuario => usuario.correo.toLocaleLowerCase() === correo.toLocaleLowerCase());
  }

  cargar() {
    const col = collection(this.firestore, this.PATH);
    const observable = collectionData(col);
  
    observable.subscribe((documentos => {
      this.listaUsuarios = documentos.map(doc => this.convertirAUsuario(doc));

      // Guardo la lista de usuarios en el Local Storage
      localStorage.setItem('usuarios', JSON.stringify(this.listaUsuarios));
    }));
  }

  private convertirAUsuario(doc: any): Usuario {
    const data = doc as any; // Acceder directamente a los datos del documento

    return new Usuario(
      data.correo,
      '', // La clave no la guardo en la BD
      data.nombreUsuario,
      data.sexo,
      data.edad
    );
  }
}