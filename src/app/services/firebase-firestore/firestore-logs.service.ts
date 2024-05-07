import { Injectable } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { Timestamp, addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreLogsService {
  private PATH = 'logs';

  constructor(private firestore: Firestore) { }

  async crear(nombreUsuario: string | undefined) {
    try {
      const col = collection(this.firestore, this.PATH);
      const fecha = Timestamp.now(); // Obtener la marca de tiempo actual
      await addDoc(col, { nombreUsuario, fecha });
    } catch (error) {
      console.error('Error al crear el log:', error);
    }
  }
}