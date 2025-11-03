import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel,
  IonButton, IonIcon, IonImg, IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';
import { LibroService } from '../service/libro-service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, startWith, switchMap, map } from 'rxjs';
import { Libro } from '../model/libro';
import { AsyncPipe, NgFor, DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { heart, heartOutline, trash } from 'ionicons/icons';

@Component({
  selector: 'app-biblioteca',
  templateUrl: 'biblioteca.html',
  styleUrls: ['biblioteca.scss'],
  imports: [
    IonIcon, IonButton, IonLabel, IonItem, IonList,
    IonRefresherContent, IonRefresher, IonSearchbar,
    IonHeader, IonToolbar, IonTitle, IonContent,
    NgFor, AsyncPipe, IonImg, DatePipe
  ]
})
export class Biblioteca {

  private service = inject(LibroService);
  private router = inject(Router);

  private refresh$ = new BehaviorSubject<string>('');
  mostrarSoloFavoritos = false;

  libros$: Observable<Libro[]> = this.refresh$.pipe(
    startWith(''),
    switchMap(searchText =>
      this.service.list(searchText).pipe(
        map(libros => this.mostrarSoloFavoritos ? libros.filter(l => l.favorito) : libros)
      )
    )
  );

  constructor() {
    addIcons({ trash, heart, heartOutline });
  }

  ionViewWillEnter() {
    this.refresh$.next(this.refresh$.value);
  }

  onSearch(evento: CustomEvent) {
    const texto_limpio = (evento.detail as any).value?.trim() ?? '';
    this.refresh$.next(texto_limpio);
  }

  refresh_Done(refresher: any) {
    this.refresh$.next(this.refresh$.value);
    refresher.complete();
  }

  add() {
    this.router.navigateByUrl('/libro/nuevo');
  }

  update(libro: Libro) {
    if (!libro.id) return;
    this.router.navigate(['/tabs/biblioteca', libro.id]);
  }

  delete(libro: Libro) {
    if (!libro.id) return;
    this.service.delete(libro.id).subscribe({
      next: () => this.refresh$.next(this.refresh$.value),
      error: err => console.error(err)
    });
  }

  toggleFavorito(libro: Libro) {
    if (!libro.id) return;

    const libroActualizado: Libro = {
      ...libro,
      favorito: !libro.favorito
    };

    this.service.update(libro.id, libroActualizado).subscribe({
      next: () => this.refresh$.next(this.refresh$.value),
      error: err => console.error(err)
    });
  }


  filtrarFavoritos(event: any) {
    this.mostrarSoloFavoritos = event.detail.value === 'favoritos';
    this.refresh$.next(this.refresh$.value);
  }
}
