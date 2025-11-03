import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonIcon, IonRouterLink, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, heart } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: 'pagina_principal.html',
  styleUrls: ['pagina_principal.scss'],
  imports: [IonFabButton, IonFab, IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonIcon, RouterLink],
})
export class Principal {
  constructor() {
    addIcons({ cartOutline });
  }
}
