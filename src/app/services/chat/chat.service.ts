import { Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private PATH = 'mensajes';
  private mensajesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private firestore: Firestore) {
    this.initChatListener();
  }

  // Esta función escucha los cambios en la colección 'mensajes' de la Base de Datos
  // Los ordena y crea un array de mensajes el cual actualiza a la variable observable
  private initChatListener(): void {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, orderBy('fecha'));

    onSnapshot(q, snapshot => {
      const mensajes: any[] = [];
      snapshot.forEach(doc => {
        mensajes.push({ id: doc.id, ...doc.data() });
      });
      this.mensajesSubject.next(mensajes);
    });
  }

  // Esta función es la que va a ser llamada por el resto de componentes
  // Devuelve la actualización del Array de Mensajes
  getMensajes(): Observable<any[]> {
    return this.mensajesSubject.asObservable();
  }

  // Función que sube un mensaje a la Base de Datos
  async guardarMensaje(remitente: string | undefined, contenido: string): Promise<void> {
    try {
      const col = collection(this.firestore, this.PATH);
      await addDoc(col, { remitente, fecha: new Date(), contenido });
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
  }
}