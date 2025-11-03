import { Component, inject } from '@angular/core';
import { BehaviorSubject, Observable, startWith, switchMap, map } from 'rxjs';
import { Libro } from '../model/libro';
import { LibroService } from '../service/libro-service';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonImg
} from '@ionic/angular/standalone';
import { AsyncPipe, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-favorito',
  templateUrl: './favorito.html',
  styleUrls: ['./favorito.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonRefresher, IonRefresherContent,
    IonList, IonItem, IonLabel, IonImg,
    NgFor, AsyncPipe, DatePipe
  ],
  standalone: true
})
export class Favorito {

  private service = inject(LibroService);
  private refresh$ = new BehaviorSubject<string>('');

  libros$: Observable<Libro[]> = this.refresh$.pipe(
    startWith(''),
    switchMap(searchText =>
      this.service.list(searchText).pipe(
        map(libros => libros.filter(l => l.favorito))
      )
    )
  );

  constructor() {
    addIcons({ heart, heartOutline });
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
}
