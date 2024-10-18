import { Injectable } from '@angular/core';
import { Auth, Persistence, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreUsuariosService } from '../firebase-firestore/firestore-usuarios.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  persistencia: Persistence = {type: 'LOCAL'};
  user$!: Observable<boolean>;
  private userSubject!: BehaviorSubject<boolean>;

  constructor(private firebaseAuth: Auth, private usuariosService: FirestoreUsuariosService) {
    console.log("Constructor - User:", this.firebaseAuth.currentUser);
    this.userSubject = new BehaviorSubject<boolean>(false);
    this.user$ = this.userSubject.asObservable();
    this.checkAuthState();
  }

  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential =  await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
      console.log("Login - User:", this.firebaseAuth.currentUser);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      console.log("Login - User:", this.firebaseAuth.currentUser);
      console.log('Usuario logeado con éxito:', this.user$);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
      console.log("Login - User:", this.firebaseAuth.currentUser);
    } catch (error) {
      throw error;
    }
  }

  async setPersistenceLocal(): Promise<void> {
    try {
      await this.firebaseAuth.setPersistence(this.persistencia);
    } catch (error) {
      throw error;
    }
  }

  getCurrentUserEmail(): string | null | undefined {
    return this.firebaseAuth.currentUser?.email;
  }

  private checkAuthState(): void {
    this.firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        console.log("El estado de autenticación cambió a TRUE");
        this.userSubject.next(true); // Usuario autenticado
      } else {
        console.log("El estado de autenticación cambió a FALSE");
        this.userSubject.next(false); // Usuario no autenticado
      }
    });
  }
}