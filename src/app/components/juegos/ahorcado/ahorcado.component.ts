import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent implements AfterViewInit {
  // Variables propias
  palabra: string = '';
  cantidadErrores: number = 0;
  cantidadAciertos: number = 0;
  listaPalabras: string[] = [
    'arbol', 'manzana', 'futbol', 'ahorcado', 'programar', 'pizza', 'gol',
    'hoja', 'comedor', 'lampara', 'murcielago', 'televisor', 'xilofon', 'leyes',
    'celular', 'laboratorio', 'numero', 'silla', 'agua', 'estrella', 'hola',
    'kiwi', 'karate', 'leyenda', 'milanesa', 'buzo', 'cirujano', 'español', 'pozo',
    'luciernaga', 'piramide', 'baño', 'ñoqui', 'pilar', 'purpura', 'calor', 'ficcion',
    'abuelo', 'saludar', 'expulsar', 'calendario', 'castillo', 'jirafa', 'catapulta'
  ];

  // Elementos del DOM
  imagen: HTMLImageElement | null = this.id('imagen') as HTMLImageElement;
  botonJugar: any = document.getElementById('botonJugar');
  botonesLetras: NodeListOf<HTMLButtonElement> = document.querySelectorAll("#contenedor-letras button");
  juegoIniciado: boolean = false;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    // Inicializo elementos del DOM después de que Angular haya inicializado la vista
    this.imagen = this.elementRef.nativeElement.querySelector('#imagen');
    this.botonJugar = this.elementRef.nativeElement.querySelector('#botonJugar');
    this.botonesLetras = this.elementRef.nativeElement.querySelectorAll(".contenedor-letras button");

    // Agrego el evento click a cada botón-letra, y les asocio la función 'clickLetras'
    this.botonesLetras.forEach(button => {
      button.addEventListener('click', this.clickLetras.bind(this));
    });
  }

  // Función que ejecuta todas las acciones del juego, inicia al pulsar el botón Jugar o Reiniciar
  iniciarJuego() {
    this.juegoIniciado = true;
    // Si ya le dio a 'Jugar', activo la bandera para habilitar los botones-tecla

    if (this.botonJugar.textContent === 'OTRA PALABRA') {
      this.reiniciarJuego();
    }
    // Si el botón ya no dice 'Jugar' y dice 'Otra Palabra', reinicio el juego y la pantalla

    this.botonJugar.textContent = 'OTRA PALABRA';
    this.cantidadErrores = 0;
    this.cantidadAciertos = 0;
    // Cambio el texto del botón, y seteo los errores y los aciertos a 0
    
    const pPalabra = this.id('palabra');
    const cantidadPalabras = this.listaPalabras.length;
    const valorRandom = this.obtenerRandom(0, cantidadPalabras);
    this.palabra = this.listaPalabras[valorRandom];
    console.log(`La palabra a adivinar es: ${this.palabra}`);
    // Tomo referencia del parrafo palabra y busco una palabra random en la lista de palabras

    for (let i = 0; i < this.botonesLetras.length; i++) {
      this.botonesLetras[i].disabled = false;
    }
    // Habilito todos los botones-tecla para que puedan ser pulsados
    
    const cantidadLetras = this.palabra.length;
    for (let i = 0; i < cantidadLetras; i++) {
      const span = document.createElement('span');
      span.textContent = '_  ';
      pPalabra?.appendChild(span);
    }
    // Recorro las letras de la palabra elegida, y escribo '_' en el párrafo por cada una
  }

  // Evento click, se ejecuta cada vez que el usuario pulsa un botón-tecla
  clickLetras(event: MouseEvent) {
    if (!this.juegoIniciado) {
      return;
    }
    // Si el juego no inició, finaliza la función y no hago nada
    
    const letraPulsada = event.target as HTMLButtonElement;
    letraPulsada.disabled = true;
    // Tomo referencia del botón pulsado, y lo deshabilito

    const letra = letraPulsada.innerHTML.toLocaleUpperCase();
    const palabra = this.palabra.toLocaleUpperCase();
    // Paso la letra pulsada y la palabra a mayúsculas

    let acerto = false;
    const spans = document.querySelectorAll('#palabra span');
    // Tomo referencia de todos los '_' del parrafo palabra

    for (let i = 0; i < palabra.length; i++) {
      if (letra == palabra[i]) {
        spans[i].textContent = `${letra} `; // Reemplazo el '_' con la letra pulsada
        this.cantidadAciertos++;
        acerto = true;
        letraPulsada.classList.add('letraAcertada');
      }
    }
    // Recorro la palabra elegida, y si la letra coincide con la letra pulsada, la reemplazo por el '_'
    // Además, aumento la cantidad de aciertos y al botón-tecla le agrego la clase CSS 'letraAcertada'

    if (!acerto) {
      this.cantidadErrores++;
      letraPulsada.classList.add('letraErrada');

      const source = `../../../../assets/images/juegos/ahorcado/estados/estado${this.cantidadErrores}.png`;
      if (this.imagen) {
        this.imagen.src = source;
      }
    }
    // Si no acertó, aumento la cantidad de errores y al botón-tecla le agrego la clase CSS 'letraErrada'
    // Además, actualizo la imagen, colocandole el nuevo estado equivalente a la cantidad de errores
  
    if (this.cantidadErrores === 7) {
      this.finalizarJuego(false);
    } else if (this.cantidadAciertos === palabra.length) {
      this.finalizarJuego(true);
    }
    // Si ya cometio 7 errores, el usuario pierde
    // Si ya acerto la misma cantidad de letras que tiene la palabra, el usuario gana
    
    console.log(`Llevas un total de: ${this.cantidadErrores} errores`);
    console.log('Letra pulsada:', letra);
  }

  // Función para tomar referencias del DOM
  private id(elemento: string) {
    return document.getElementById(elemento);
  }
    
  // Función que me devuelve un random
  private obtenerRandom(min: number, max: number) {
    const amplitudValores = max - min;
    const valorRandom = Math.floor(Math.random() * amplitudValores) + min;
    return valorRandom;
  }

  // Función que se ejecuta al finalizar el juego
  private finalizarJuego(jugadorGano: boolean) {
    if (jugadorGano) {
      this.id('resultado')!.innerHTML = 'GANASTEEEEE!!';
    } else {
      this.id('resultado')!.innerHTML = 'AHORCADO! La palabra era: ' + this.palabra;
    }
    // Dependiendo de si ganó o no, cambio el mensaje

    this.botonJugar.textContent = 'JUGAR';
    for( let i = 0; i < this.botonesLetras.length ; i++ ) {
      this.botonesLetras[i].disabled = true;
    }
    // Cambio el botón del texto a 'JUGAR', y deshabilito a todos los botones-tecla
  }

  // Función que se ejecuta al reiniciar el juego
  private reiniciarJuego() {
    this.botonesLetras.forEach(button => {
      button.removeEventListener('click', this.clickLetras.bind(this));
    });
    // Elimino los event listeners de los botones-letra

    for( let i = 0; i < this.botonesLetras.length ; i++ ) {
      this.botonesLetras[i].disabled = false;
      this.botonesLetras[i].classList.remove('letraAcertada');
      this.botonesLetras[i].classList.remove('letraErrada');
    }
    // Reseteo los botones-tecla a su estado base, sin clase y habilitados

    const pPalabra = this.id('palabra');
    while (pPalabra!.firstChild) {
      pPalabra!.removeChild(pPalabra!.firstChild);
    }
    // Tomo referencia del párrafo palabra y le borro todos los '_'

    const pResultado = this.id('resultado');
    pResultado!.textContent = '';
    this.cantidadErrores = 0;
    this.cantidadAciertos = 0;
    // Borro el mensaje de resultado y reseteo la cantidad de aciertos y errores

    const source = `../../../../assets/images/juegos/ahorcado/estados/estado${this.cantidadErrores}.png`;
    if (this.imagen) {
      this.imagen.src = source;
    }
    // Actualizo la imagen a su primer estado para empezar de 0
  }
}