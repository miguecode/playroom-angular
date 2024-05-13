import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { palabrasFaciles as palabrasFacilesExportada } from './listas-de-palabras/palabras-faciles';
import { palabrasRegulares as palabrasRegularesExportada } from './listas-de-palabras/palabras-regulares';
// import { palabrasDificiles as palabrasDificilesExportada } from './listas-de-palabras/palabras-dificiles';


@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './palabras-desordenadas.component.html',
  styleUrl: './palabras-desordenadas.component.css'
})
export class PalabrasDesordenadasComponent {
  palabrasFaciles: string[] = palabrasFacilesExportada;
  palabrasRegulares: string[] = palabrasRegularesExportada;
  // palabrasDificiles: string[] = palabrasDificilesExportada;

  juegoIniciado: boolean = false;
  primerPalabraDesordenada: string = '';
  segundaPalabraDesordenada: string = '';
  tercerPalabraDesordenada: string = '';
  primerPalabraOriginal: string = '';
  segundaPalabraOriginal: string = '';
  tercerPalabraOriginal: string = '';
  respuestaPrimerPalabra: string = '';
  respuestaSegundaPalabra: string = '';
  respuestaTercerPalabra: string = '';
  nivelActual: number = 1;
  nivelActualCompletado: boolean = false;
  intervaloTiempo: any;
  tiempoRestante: number = 60;
  juegoFinalizado: boolean = false;
  mensajeTitulo: string = '';
  mensajeTexto: string = '';
  cantidadPartidasJugadas: number = 0;


  // Función que se ejecuta cada vez que se inicia un nivel
  jugar() {
    this.juegoIniciado = true;
    this.juegoFinalizado = false;
    // Actualizo las banderas del estado del juego y el tiempo restante

    this.tiempoRestante = 60;
    // Limpio cualquier intervalo anterior antes de iniciar uno nuevo

    clearInterval(this.intervaloTiempo);
    // Establezco el tiempo máximo del nivel

    this.nivelActualCompletado = false;
    // Desactivo la bandera de nivel completado

    this.elegirPalabrasOriginalesAlAzar();
    // Cargo los valores de las 3 palabras originales con 3 palabras random

    this.primerPalabraDesordenada = this.desordenarPalabra(this.primerPalabraOriginal);
    this.segundaPalabraDesordenada = this.desordenarPalabra(this.segundaPalabraOriginal);
    this.tercerPalabraDesordenada = this.desordenarPalabra(this.tercerPalabraOriginal);
    // Desordeno las 3 palabras elegidas

    // Creo un intervalo que disminuye el tiempo restante en 1, cada 1 segundo
    this.intervaloTiempo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        // Si se terminó el tiempo, el jugador pierde
        this.finalizarJuego(false);
        clearInterval(this.intervaloTiempo); // Limpio el intervalo
      }
    }, 1000); // Se ejecuta la función cada 1000 milisegundos (un segundo)
  }

  // Función que elige 3 palabras al azar dependiendo el nivel
  elegirPalabrasOriginalesAlAzar() {
    // Dependiendo del nivel actual, saco las palabras de un array u otro
    if (this.nivelActual <= 2) {
      this.elegirPalabrasDelArray(this.palabrasFaciles);
    } else if (this.nivelActual <= 5) {
      this.elegirPalabrasDelArray(this.palabrasRegulares);
    } else {
      // this.elegirPalabrasDelArray(this.palabrasDificiles);
    }
  }


  // Función que elige las 3 palabras al azar, y las borra de cada array para que no se repitan
  elegirPalabrasDelArray(arrayPalabras: string[]) {
    const indice1 = Math.floor(Math.random() * arrayPalabras.length);
    this.primerPalabraOriginal = arrayPalabras.splice(indice1, 1)[0];
    const indice2 = Math.floor(Math.random() * arrayPalabras.length);
    this.segundaPalabraOriginal = arrayPalabras.splice(indice2, 1)[0];
    const indice3 = Math.floor(Math.random() * arrayPalabras.length);
    this.tercerPalabraOriginal = arrayPalabras.splice(indice3, 1)[0];

    console.log(`Palabras: "${this.primerPalabraOriginal} - 
    ${this.segundaPalabraOriginal} - ${this.tercerPalabraOriginal}`);
  }
  

  // Función que recibe una palabra y la devuelve desordenada
  desordenarPalabra(palabra: string): string {
    let palabraDesordenada = palabra;

    // Convierto la palabra en un array de caracteres
    do {
      const caracteres = palabra.split('');
      palabraDesordenada = caracteres.sort(() => Math.random() - 0.5).join('');
    } while (palabra === palabraDesordenada);
    // Si la palabra es muy corta existe la posibilidad que el desordenamiento haga que quede igual
    // Por eso hago el do-while, para que lo repita hasta que quede verdaderamente desordenada

    return palabraDesordenada;
  }


  // Función que verifica que la respuesta escrita por input es correcta
  // Si es correcta, deshabilita esa input en particular
  // Además, cada vez que se ejecuta se fija si ya están las 3 palabras adivinadas
  verificarRespuesta(palabra: string) {
    switch (palabra) {
      case 'primerPalabra':
        if (this.respuestaPrimerPalabra.toLowerCase() === this.primerPalabraOriginal.toLowerCase()) {
          this.desactivarInput('primerPalabra');
        }
        break;
      case 'segundaPalabra':
        if (this.respuestaSegundaPalabra.toLowerCase() === this.segundaPalabraOriginal.toLowerCase()) {
          this.desactivarInput('segundaPalabra');
        }
        break;
      case 'tercerPalabra':
        if (this.respuestaTercerPalabra.toLowerCase() === this.tercerPalabraOriginal.toLowerCase()) {
          this.desactivarInput('tercerPalabra');
        }
        break;
      default:
        break;
    }

    // Verifico si las 3 palabras ya están adivinadas o no
    if (this.verificarNivelCompletado()) {
      clearInterval(this.intervaloTiempo);
      // Si se completó el nivel, freno el tiempo

      if (this.nivelActual === 5) {
        this.finalizarJuego(true);
        // Si acaba de completar el nivel 5, el usuario gana el juego
      } else {
        this.nivelActualCompletado = true;
        // Si no es así, se activa la bandera que muestra el botón 'Siguiente nivel'
      }
    }
  }


  // Función que verifica que si las 3 palabras estan adivinadas
  verificarNivelCompletado(): boolean {
    return (
      this.respuestaPrimerPalabra.toLowerCase() === this.primerPalabraOriginal.toLowerCase() &&
      this.respuestaSegundaPalabra.toLowerCase() === this.segundaPalabraOriginal.toLowerCase() &&
      this.respuestaTercerPalabra.toLowerCase() === this.tercerPalabraOriginal.toLowerCase()
    );
  }


  // Función que desactiva las inputs cuya palabra ya está adivinada
  desactivarInput(palabra: string) {
    switch (palabra) {
      case 'primerPalabra':
        document.getElementById('inputPrimerPalabra')!.setAttribute('disabled', 'true');
        document.getElementById('elementoUno')!.classList.add('elementoCorrecto');
        break;
      case 'segundaPalabra':
        document.getElementById('inputSegundaPalabra')!.setAttribute('disabled', 'true');
        document.getElementById('elementoDos')!.classList.add('elementoCorrecto');
        break;
      case 'tercerPalabra':
        document.getElementById('inputTercerPalabra')!.setAttribute('disabled', 'true');
        document.getElementById('elementoTres')!.classList.add('elementoCorrecto');
        break;
      default:
        break;
    }
  }


  // Función que se ejecuta cuando el usuario pasa al siguiente nivel
  // Limpia las respuestas, habilita las inputs y aumenta el valor del nivel actual
   siguienteNivel() {
    this.respuestaPrimerPalabra = '';
    this.respuestaTercerPalabra= '';
    this.respuestaSegundaPalabra = '';
    document.getElementById('inputPrimerPalabra')!.removeAttribute('disabled');
    document.getElementById('inputSegundaPalabra')!.removeAttribute('disabled');
    document.getElementById('inputTercerPalabra')!.removeAttribute('disabled');
    document.getElementById('elementoUno')!.classList.remove('elementoCorrecto');
    document.getElementById('elementoDos')!.classList.remove('elementoCorrecto');
    document.getElementById('elementoTres')!.classList.remove('elementoCorrecto');

    this.nivelActual++;

    /*if(this.nivelActual === 6) {
      document.getElementById('contenedor')!.classList.add('imagenNivelSeis');
    }*/

    this.jugar();
  }


  // Función que se ejecuta cuando el usuario gana o pierde
  finalizarJuego(gano: boolean) {
    this.juegoFinalizado = true;
    this.cantidadPartidasJugadas++;
    document.getElementById('contenedor')!.classList.remove('imagenNivelSeis');

    if (gano) {
      this.mensajeTitulo = '🔥 ¡Felicidades! 🔥';
      this.mensajeTexto = '¡Superaste todos los niveles! Sos un maestro del ordenamiento de palabras. Puntuación final:';
    } else {
      this.mensajeTitulo = '😞 Muy lento 😞';
      this.mensajeTexto = '¡Se te terminó el tiempo! Intentalo otra vez, pero ahora tenés que ser mas rápido.';
    }
  }


  // Función que se ejecuta cuando el usuario hace clic en 'Jugar otra vez'
  jugarOtraVez() {
    if (this.cantidadPartidasJugadas === 14) {
      this.palabrasFaciles = palabrasFacilesExportada;
      this.palabrasRegulares = palabrasRegularesExportada;
      // this.palabrasDificiles = palabrasDificilesExportada;
      this.cantidadPartidasJugadas = 0;
    }
    // Si el usuario ya jugó X partidas, reinicio la lista de palabras

    this.reiniciarJuego();
    this.jugar();
  }


  // Función que resetea todos los elementos del juego a 0
  reiniciarJuego() {
    this.juegoFinalizado = false;
    this.nivelActual = 1;
    this.nivelActualCompletado = false;
    this.primerPalabraDesordenada = '';
    this.segundaPalabraDesordenada = '';
    this.tercerPalabraDesordenada = '';
    this.primerPalabraOriginal = '';
    this.segundaPalabraOriginal = '';
    this.tercerPalabraOriginal = '';
    this.respuestaPrimerPalabra = '';
    this.respuestaSegundaPalabra = '';
    this.respuestaTercerPalabra = '';
  }


  // Función que hace que la input escriba siempre en mayúsculas
  convertirAMayusculas(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }
}