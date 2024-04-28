export class Usuario {
  correo: string;
  clave: string;
  nombreUsuario: string;
  // edad: number;

  constructor(correo: string, clave: string, nombreUsuario: string) {
    this.correo = correo;
    this.clave = clave;
    this.nombreUsuario = nombreUsuario;
  }
}