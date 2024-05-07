import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { FirestoreUsuariosService } from '../../services/firebase-firestore/firestore-usuarios.service';
import { AuthService } from '../../services/firebase-auth/auth.service';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
  mensajes: any[] = [];
  mensajeNuevo: string = '';
  usuarioActual: any;
  @ViewChild('cuerpoChat') cuerpoChat!: ElementRef;

  constructor(private chatService: ChatService, private authService: AuthService, private usuariosService: FirestoreUsuariosService) { }

  ngOnInit(): void {
    // Me suscribo a los mensajes del chat en tiempo real
    this.chatService.getMensajes().subscribe(mensajes => {
      // Formateo la fecha de cada mensaje antes de mostrarlo
      this.mensajes = mensajes.map(mensaje => {
        return {
          ...mensaje,
          fechaFormateada: this.formatearFecha(mensaje.fecha)
        };

      });
      // Mapeé el array que me trae 'getMensajes', guardándolo en el array this.mensajes
      // A cada elemento le agregué una nueva propiedad 'fechaFormateada' que es la que voy a mostrar
      
      // Mando el scroll del chat hasta lo más bajo
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);

      console.log('Estoy en el componente CHAT y los mensajes recibidos son:');
      console.log(this.mensajes);
    });
  }
  
  enviarMensaje(): void {
    if (this.validarMensaje()) {
      // Tomo el nombre del usuario actual
      const correo = this.authService.getCurrentUserEmail();
      this.usuarioActual = this.usuariosService.getUsuarioPorCorreo(correo!);

      // Guardo el mensaje en la BD
      this.chatService.guardarMensaje(this.usuarioActual.nombreUsuario, this.mensajeNuevo.trim());
      
      // Mando el scroll del chat hasta lo más bajo
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);

      // Limpio la input una vez que ya se envió
      this.mensajeNuevo = '';
    }
  }

  private formatearFecha(fecha: any): string {
    const fechaDate = fecha.toDate();
    const fechaFormateada = formatDate(fechaDate, '[dd/MM - HH:mm]', 'en-US');
    return fechaFormateada;
  }

  // Función que manda el scroll hacia lo más bajo
  scrollToBottom(): void {
    try {
      this.cuerpoChat.nativeElement.scrollTop = this.cuerpoChat.nativeElement.scrollHeight;
    } catch(err) { }
  }

  validarMensaje(): boolean {
    return this.mensajeNuevo.trim() !== '' && this.mensajeNuevo.length < 500;
  }
}