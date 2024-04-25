export class Usuario {
  correo: string;
  clave: string;
  nombre: string;
  edad: number;

  constructor(correo: string, clave: string, nombre: string, edad: number) {
    this.correo = correo;
    this.clave = clave;
    this.nombre = nombre;
    this.edad = edad;
  }
}