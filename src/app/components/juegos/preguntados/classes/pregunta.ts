export class Pregunta {
  texto: string;
  opciones: string[];
  respuestaCorrecta: string;
  categoria: string;

  constructor(texto: string, opciones: string[], respuestaCorrecta: string, categoria: string) {
    this.texto = texto;
    this.opciones = opciones;
    this.respuestaCorrecta = respuestaCorrecta;
    this.categoria = categoria;
  }
}
