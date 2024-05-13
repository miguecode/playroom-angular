import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIPreguntasService } from '../../../services/API/api-preguntas.service';
import { Pregunta } from './classes/pregunta';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent {
  juegoIniciado: boolean = false;
  botonJugarOtraVez: boolean = false;
  preguntaActual!: Pregunta | null;
  opcionesActuales: string[] = [];
  respuestaCorrecta: string = '';
  yaRespondio: boolean = false;
  vidasRestantes: number = 3;
  numeroDePreguntaActual: number = 1;
  preguntas: Pregunta[] = [];
  cargando: boolean = false;
  mensaje: string = '';
  intervaloTiempo: any = null;
  duracionPartida: number = 0;

  //private preguntasService = inject(APIPreguntasService);
  // Esta es otra forma de manipular el servicio, pero en este caso lo voy a hacer en el constructor

  constructor(private apiService: APIPreguntasService) { }


  // Función que inicia el juego, se ejecuta cuando el usuario le da a 'Jugar' o a 'Jugar otra vez'
  jugar() {
    if (this.botonJugarOtraVez) {
      this.reiniciarJuego();
    }
    // Si se dio clic en 'jugar otra vez', reinicio el juego completamente desde 0

    this.juegoIniciado = true;
    // Marco banderas al iniciar el juego
    
    this.cargando = true;
    // Marco la bandera de que se están cargando las preguntas
    // En el HTML, pregunto si es TRUE, y si lo es, muestro un Loader

    this.cargarListaDePreguntas();
    // Cargo el array de preguntas consumiendo la API

    this.iniciarContadorTiempo();
    // Inicio el contador de tiempo de la partida, para saber al final cuanto duró

    setTimeout(() => {
      this.cargando = false;
      // Ya no se está cargando, por lo tanto dejo de mostrar el Loader

      this.preguntaActual = this.obtenerNuevaPregunta();
      // Tomo una pregunta del array de preguntas, de forma aleatoria
  
      this.opcionesActuales = this.mezclarOpciones(this.preguntaActual.opciones);
      // Al array de opciones actuales, le asigno el array de opciones de la pregunta actual
    }, 3500);
    // Estas funciones las tuve que meter en un setTimeOut para esperar un poco antes de su ejecución
    // Esto fue así ya que el servicio tarda un poco en traer la data. Entonces tenemos que darle ese tiempo
    // Ya que sino, el programa va a intentar mostrar la pregunta y las opciones cuando la lista de preguntas todavia no se cargó
  }

  // Función que limpia la pantalla y además restablece todos los valores del juego
  reiniciarJuego() {
    this.limpiarPantalla();
    this.vidasRestantes = 3;
    this.numeroDePreguntaActual = 1;
    this.botonJugarOtraVez = false;
    this.duracionPartida = 0;
  }


  // Función que se conecta al servicio encargado de consumir la API de preguntas
  // Recibe un array desde la API, y lo transforma en un array de elementos tipo 'Pregunta'
  cargarListaDePreguntas() {
    // Me suscribo al observable del servicio de API Preguntas
    this.apiService.getPreguntas().subscribe((data: any) => {

      // Con la data que me devuelve el observable, cargo la lista de preguntas
      // Por cada dato recibido, lo convierto en una instancia de la clase Pregunta
      this.preguntas = data.results.map((resultado: any) => {
        // console.log(data.results);
        return new Pregunta(resultado.question, resultado.incorrect_answers.concat(resultado.correct_answer),
         resultado.correct_answer, resultado.category);
      });
      // 'results' es un array de preguntas que me devuelve la API
      // La propiedad 'results' y las otras propiedades como question, incorrect_answers, y correct_answer
      // son específicas de la API que estoy usando la cual es Open Trivia Database
    });
  }


  // Función que devuelve una pregunta seleccionada al azar
  obtenerNuevaPregunta(): Pregunta {
    let numeroRandom = Math.floor(Math.random() * this.preguntas.length);
    console.log('Respuesta correcta: ' + this.preguntas[numeroRandom].respuestaCorrecta);
    return this.preguntas[numeroRandom];
    // Tomo una pregunta del array de preguntas, de forma aleatoria
  }


  // Función que mezcla las posiciones del array opciones, y lo devuelve
  mezclarOpciones(options: string[]): string[] {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]]; // Swap
    }
    return options;
  }


  // Función que hace un setInterval, y le paso una función que se repetirá cada segundo
  iniciarContadorTiempo() {
    this.intervaloTiempo = setInterval(() => {
      this.duracionPartida++; // La función lo que hace es sumar en 1 la duración de la partida
    }, 1000);
  }


  // Función que se ejecuta cuando el usuario elige una de las opciones
  seleccionarRespuesta(opcion: string) {
    if (!this.yaRespondio) {
      this.yaRespondio = true; // Marcar que ya se respondió, para que aparezca el botón 'Siguiente'
      this.agregarClaseBoton(opcion);

      // Verifico que la respuesta sea la correcta
      if (opcion === this.preguntaActual?.respuestaCorrecta) {
        this.mensaje = '¡Correcto!';
        document.getElementById('parrafoMensaje')?.classList.add('mensajeCorrecto');

      } else {
        this.mensaje = '¡Incorrecto!';
        document.getElementById('parrafoMensaje')?.classList.add('mensajeIncorrecto');
        this.vidasRestantes--;
      }
    }

    // Compruebo el estado de la partida para saber cómo seguir
    if (this.numeroDePreguntaActual === 10 && this.vidasRestantes > 0) {
      this.finalizarJuego(true);
    } else if (this.vidasRestantes === 0) {
      this.finalizarJuego(false);
    }
  }


  // Función que se ejecuta cuando el usuario pulsa en Siguiente
  siguientePregunta() {
    this.limpiarPantalla(); // Limpio todos los elementos preparando la siguiente pregunta
    this.numeroDePreguntaActual++; // Aumento en 1 la pregunta actual
    this.preguntaActual = this.obtenerNuevaPregunta(); // Actualizo la pregunta actual
    this.opcionesActuales = this.mezclarOpciones(this.preguntaActual.opciones); // Actualizo las opciones
  }


  // Función que se ejecuta cuando termina el juego ya sea ganando o perdiendo
  finalizarJuego(gano: boolean) {
    this.botonJugarOtraVez = true;
    // Muestro el botón 'Jugar otra vez'

    clearInterval(this.intervaloTiempo);
    console.log('La partida duró: ' + this.duracionPartida + ' segundos');
    // Detengo el contador de tiempo

    let tiempoExtra = this.duracionPartida * 10; // Por ejemplo, 10 puntos por segundo extra
    let puntuacion = 3000 + (this.vidasRestantes * 1000) - tiempoExtra;
    // Calculo la puntuación basado en la duración de la partida y las vidas restantes

    if (gano) {
      document.getElementById('parrafoMensaje')?.classList.add('mensajeCorrecto');
      this.mensaje = '¡¡GANASTE!! 🤩 Puntuación final: ' + puntuacion;
    } else {
      document.getElementById('parrafoMensaje')?.classList.add('mensajeIncorrecto');
      this.mensaje = '¡Fin del juego! Te quedaste sin vidas 😢';
    }
  }


  // Función que le agrega estilos a las opciones una vez ya se eligió una
  agregarClaseBoton(opcion: string) {
    // Utiliza el método querySelectorAll para seleccionar todos los botones de respuesta
    // y luego los itera para encontrar el botón correspondiente a la respuesta seleccionada
    const botones = document.querySelectorAll('.botonOpcion');
    botones.forEach((boton: any) => {
      if (boton.textContent === opcion) {
        if (opcion === this.preguntaActual?.respuestaCorrecta) {
          boton.classList.add('opcionCorrecta');
        } else {
          boton.classList.add('opcionIncorrecta');
        }
      } else {
        if (boton.textContent === this.preguntaActual!.respuestaCorrecta) {
          boton.classList.add('opcionCorrecta');
        }
      }
    });
  }


  // Función que limpia todos los elementos de la pantalla a su estado base
  limpiarPantalla() {
    this.yaRespondio = false; // Reinicio bandera de respuesta
    this.mensaje = ''; // Limpio el mensaje

    document.getElementById('parrafoMensaje')?.classList.remove('mensajeIncorrecto');
    document.getElementById('parrafoMensaje')?.classList.remove('mensajeCorrecto');
    // Elimino las clases posibles del mensaje

    const botones = document.querySelectorAll('.botonOpcion');
    botones.forEach((boton: any) => {
      boton.classList.remove('opcionCorrecta');
      boton.classList.remove('opcionIncorrecta');
    });
    // Elimino las clases posibles de cada opción

    const indice = this.preguntas.findIndex(pregunta => pregunta === this.preguntaActual);
    if (indice !== -1) {
      this.preguntas.splice(indice, 1);
    }
    // Elimino la pregunta de la lista de preguntas
  }
}