import { Component, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonButtons, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonNote, IonFab, IonFabButton, IonBackButton
} from "@ionic/angular/standalone";
import {CurrencyPipe, NgFor} from '@angular/common';
import { CarritoService } from '../../service/carrito-service';
import { Carrito } from '../../model/carrito';
import {RouterLink} from "@angular/router";
import {cartOutline, wallet} from 'ionicons/icons';
import {addIcons} from "ionicons";

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true,
  imports: [
    IonLabel, IonItem, IonList, IonContent,
    IonTitle, IonToolbar, IonHeader, NgFor, IonIcon, RouterLink, IonNote, CurrencyPipe, IonFab, IonFabButton, IonBackButton, IonButtons
  ],
})

export class CarritoComponent {
  private carritoService = inject(CarritoService);
  sales = signal<Carrito[]>([]);

  constructor() {
    this.load();
    addIcons({ wallet });
  }

  load() {
    this.carritoService.getAll().subscribe({
      next: (sales) => this.sales.set(sales),
      error: (err) => console.error(err)
    });
  }

  trackById = (_: number, s: Carrito) => s.id!;
}

