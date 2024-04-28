import { Injectable } from '@angular/core'; // Antes poniamos aca también un 'inject' y un 'signal'
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import {Observable, from} from 'rxjs'; // Ya no voy a usarlo, antes lo usaba para poder devolver un Observable

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user$ = user(this.firebaseAuth);
  estadoAutenticacion: boolean = false;

  constructor(private firebaseAuth: Auth) { }

  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential =  await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
      this.estadoAutenticacion = true;
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      this.estadoAutenticacion = true;
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async cerrarSesion(): Promise<void> {
    await signOut(this.firebaseAuth);
    this.estadoAutenticacion = false;
  }

  estaAutenticado(): boolean {
    return this.estadoAutenticacion;
  }

  // De esta forma devolvemos un Observable
  /*
  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.firebaseAuth, email, password));
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password));
  }
  */
}