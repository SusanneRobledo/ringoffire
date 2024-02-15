import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-58984","appId":"1:508510012064:web:54f0c340508668286effc5","storageBucket":"ring-of-fire-58984.appspot.com","apiKey":"AIzaSyB0iXNSq6ldFlo3ApbbI5xamZkfKrWTbkM","authDomain":"ring-of-fire-58984.firebaseapp.com","messagingSenderId":"508510012064"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
