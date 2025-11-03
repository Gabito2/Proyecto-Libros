import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu',
  templateUrl: 'pagina_principal.html',
  styleUrls: ['pagina_principal.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonImg],
})
export class Principal {
  constructor() { }
}
