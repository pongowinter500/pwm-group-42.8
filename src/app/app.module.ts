/**
 * SCAFFOLDING COMMANDS
 * Run these in order to set up the Ionic + Angular project:
 *
 * ionic start FavoritesApp blank --type=angular
 * cd FavoritesApp
 * npm install @angular/fire firebase
 * npm install @capacitor-community/sqlite
 * npm install @capacitor/core @capacitor/cli
 * npx cap init FavoritesApp com.example.favoritesapp
 * ionic generate page pages/login
 * ionic generate page pages/register
 * ionic generate page pages/home
 * ionic generate page pages/favorites
 * ionic generate page pages/detail
 * ionic generate page pages/profile
 * ionic generate service services/auth
 * ionic generate service services/firestore
 * ionic generate service services/database
 * ionic generate service services/favorites
 * ionic generate guard guards/auth
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AppComponent
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: []
})
export class AppModule { }
