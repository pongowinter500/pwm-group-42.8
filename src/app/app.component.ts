import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // <-- 1. Importato CUSTOM_ELEMENTS_SCHEMA
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterOutlet, RouterLink],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // <-- 2. Aggiunto qui per riconoscere il tag <jeep-sqlite>
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}