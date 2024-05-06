import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent implements AfterViewInit {
  // Variables propias
  puntuacion: number = 0;
  mensaje: string = '¿Qué será la próxima carta?';
  cartaActual: number = 1;

  // Elementos del DOM
  imagen: HTMLImageElement | null = this.id('imagen') as HTMLImageElement;
  botonMayor: any = document.getElementById('boton-mayor');
  botonMenor: any = document.getElementById('boton-menor');

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    // Inicializo elementos del DOM después de que Angular haya inicializado la vista
    this.imagen = this.elementRef.nativeElement.querySelector('#imagen');
    this.botonMayor = this.elementRef.nativeElement.querySelector('#boton-mayor');
    this.botonMenor = this.elementRef.nativeElement.querySelector("#boton-menor");

    // Agrego eventos a los botones Mayor y Menor, y los asocio con la función jugar
    this.botonMayor.addEventListener('click', () => this.jugar('mayor'));
    this.botonMenor.addEventListener('click', () => this.jugar('menor'));
  }

  // Función que ejecuta todas las acciones del juego, inicia al pulsar algún botón
  jugar(opcionElegida: string) {
    this.botonMayor.disabled = true;
    this.botonMenor.disabled = true;
    // Deshabilito los botones un tiempo para evitar posibles bugs

    const nuevaCarta = this.obtenerRandom(1, 12, this.cartaActual);
    this.actualizarImagen(nuevaCarta);
    // Obtengo un random que va a ser la carta a mostrar y actualizo la imagen con ella

    setTimeout(() => { 
      this.verificarCarta(nuevaCarta, opcionElegida); // Confirmo si acertó o no
      this.botonMayor.disabled = false;
      this.botonMenor.disabled = false;
      // Vuelvo a habilitar los botones
    }, 500);
    // Espero 500 milisegundos para realizar esto, para usar una transición
  }
  
  // Funcion que aumenta la puntuación o finaliza el juego dependiendo del resultado
  verificarCarta(nuevaCarta: number, opcion: string) {
    if (opcion === 'mayor' && nuevaCarta > this.cartaActual) {
      this.puntuacion += 100;
    } else if (opcion === 'menor' && nuevaCarta < this.cartaActual) {
      this.puntuacion += 100;
    } else {
      this.finalizarJuego(); // Si no acertó, se termina el juego
    }

    this.cartaActual = nuevaCarta; // La carta actual pasa a ser la que salió del mazo
  }

  // Función que actualiza la imagen de la carta actual
  private actualizarImagen(numeroCarta: number) {
    const nuevaImagen = this.elementRef.nativeElement.querySelector('#imagen');
    nuevaImagen.classList.add('animacion-salida');
    // Primero tomo su referencia, y le agrego la clase CSS llamda animacion salida
  
    setTimeout(() => {
      nuevaImagen.classList.add('animacion-entrada');
      const source = `../../../../assets/images/juegos/mayor-menor/cartas/carta${numeroCarta}.png`;
      nuevaImagen.src = source;
    }, 200); // Tiempo suficiente para que la animación de salida se ejecute antes de cambiar la imagen

    // Hay que sacarle las clases porque sino se bugea
    setTimeout(() => {
      nuevaImagen.classList.remove('animacion-entrada');
      nuevaImagen.classList.remove('animacion-salida');
    }, 800); // Tiempo suficiente para que la animación de entrada termine completamente
  }

  // Funcion que se ejecuta cuando el usuario desacierta
  private finalizarJuego() {
    this.mensaje = `Fin del Juego! Tu puntuación final fue de ${this.puntuacion} puntos`;
    this.botonMayor.style.display = "none";
    this.botonMenor.style.display = "none";
    // Cambio el mensaje y oculto los botones de Mayor y Menor

    const botonReiniciar = this.elementRef.nativeElement.querySelector("#boton-reiniciar");
    botonReiniciar.style.display = "block";
    botonReiniciar.addEventListener('click', this.reiniciarJuego.bind(this));
    // Muestro el botón 'Volver a Jugar' y le agrego un evento de click vinculado a la función 'reiniciarJuego'
  }

  // Función que reestablece todos los valores de la pantalla
  reiniciarJuego() {
    this.puntuacion = 0;
    this.mensaje = '¿Qué será la próxima carta?';
    this.botonMayor.style.display = "block";
    this.botonMenor.style.display = "block";
    // Pongo la puntuación en 0, cambio el mensaje y vuelvo a mostrar los botones Mayor y Menor
        
    this.cartaActual = 1;
    this.actualizarImagen(1);
    // La carta actual vuelve a ser 1 y actualizo su imagen

    const botonReiniciar = this.elementRef.nativeElement.querySelector("#boton-reiniciar");
    botonReiniciar.style.display = "none";
    // Tomo referencia del botón 'Volver a Jugar' y lo oculto
  }

  // Función para tomar referencias del DOM
  private id(elemento: string) {
    return document.getElementById(elemento);
  }
  
  // Función que me devuelve un random, con una excepción
  private obtenerRandom(min: number, max: number, excepto: number) {
    let valorRandom;

    do {
      valorRandom = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (valorRandom === excepto);

    return valorRandom;
  }
}