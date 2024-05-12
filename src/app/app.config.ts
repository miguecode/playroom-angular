import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), importProvidersFrom(provideFirebaseApp(() => initializeApp({
    "projectId":"sala-de-juegos-82d5a",
    "appId":"1:28981568672:web:5e36f916525d69954e15c5",
    "storageBucket":"sala-de-juegos-82d5a.appspot.com",
    "apiKey":"AIzaSyDvGEdI5mnuRerkMPrKYsuVNdJzSh0a7lA",
    "authDomain":"sala-de-juegos-82d5a.firebaseapp.com",
    "messagingSenderId":"28981568672",
    "measurementId":"G-3MY1DHJ0HG"}))), 
    importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};