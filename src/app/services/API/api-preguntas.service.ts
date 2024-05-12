import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIPreguntasService {
  private http = inject(HttpClient);
  
  constructor() {}

  // Voy a devolver un Observable que puede ser de cualquier tipo
  getPreguntas(): Observable<any> {
    return this.http.get('https://opentdb.com/api.php?amount=10&type=multiple');
  }

/*
  En el servicio no es necesario suscribirse al observable get() del HttpClient. En su lugar, este método retorna directamente un observable que el componente consumirá y se suscribirá a él cuando llame al método getPreguntas().

  La diferencia radica en cómo se maneja la lógica de suscripción a este observable. En el ejemplo de getData(), el suscribe está dentro del servicio, lo que significa que el servicio mismo consume la respuesta de la solicitud HTTP y hace algo con ella (en este caso, mostrarla por consola). Sin embargo, en este ejemplo, el suscribe no aparece acá, ya que será usado en el componenteo, lo que significa que es el componente quien maneja la respuesta de la solicitud HTTP y realiza acciones basadas en ella (por ejemplo, cargar las preguntas en el juego).
*/


  /*        Ejemplo básico 
  getData() {
    const observable = this.http.get('URL DE LA API QUE QUEREMOS CONSUMIR');
    // Esto retorna un Observable
    // Un Observable es una respuesta asíncrona más eficiente
    // Al 'get' le pasamos un string que va a ser la URL de la API a consumir

    // Nos suscribimos al observable mediante 'data' para manipularlo acá mismo
    observable.subscribe(data => {
      console.log(data);
    })
  }
  */
}
