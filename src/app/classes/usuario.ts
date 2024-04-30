export class Usuario {
  correo: string;
  clave: string;
  nombreUsuario: string;
  sexo: string;
  edad: number;

  constructor(correo: string, clave: string, nombreUsuario: string, sexo: string, edad: number) {
    this.correo = correo;
    this.clave = clave;
    this.nombreUsuario = nombreUsuario;
    this.sexo = sexo;
    this.edad = edad;
  }
}