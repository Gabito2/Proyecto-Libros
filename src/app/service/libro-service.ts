import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Libro } from '../model/libro';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.api}/libros`;


  private date_to_iso(date: Date | string): string {
    const dt = (date instanceof Date) ? date : new Date(date);
    return isNaN(dt.getTime()) ? '' : dt.toISOString().split('T')[0];
  }

  // list(): Observable<Libro[]> {
  //   return this.http.get<any[]>(this.baseUrl).pipe(
  //     map(rows => rows.map(r => ({
  //       ...r,
  //       fecha_publicacion: new Date(r.fecha_publicacion)
  //     } satisfies Libro)))
  //   );
  // }

  list(search?: string): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.baseUrl).pipe(
      map(libros => {
        if (!search) return libros;
        return libros.filter(libro =>
          libro.titulo.toLowerCase().includes(search.toLowerCase()) ||
          libro.autor.toLowerCase().includes(search.toLowerCase()) ||
          libro.genero.toLowerCase().includes(search.toLowerCase()) ||
          libro.editorial.toLowerCase().includes(search.toLowerCase())
        );
      })
    );
  }


  getById(id: string): Observable<Libro> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(r => ({ ...r, fecha_publicacion: new Date(r.fecha_publicacion) } as Libro))
    );
  }

  create(payload: Libro): Observable<Libro> {
    const body = {
      ...payload,
      fecha_publicacion: this.date_to_iso(payload.fecha_publicacion)
    };
    return this.http.post<Libro>(this.baseUrl, body);
  }

  update(id: string, payload: Libro): Observable<Libro> {
    const body = {
      ...payload,
      fecha_publicacion: this.date_to_iso(payload.fecha_publicacion)
    };
    return this.http.put<Libro>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    alert(id);
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => throwError(() => this.wrap(err)))
    );
  }

  private wrap(err: unknown) {
    console.error('API error', err);
    return new Error('Error comunicando con el servidor');
  }

}
