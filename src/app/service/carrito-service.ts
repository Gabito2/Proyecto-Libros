import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Carrito } from '../model/carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.api_carrito}/carrito`;

  getAll(): Observable<Carrito[]> { return this.http.get<Carrito[]>(this.baseUrl); }

  getById(id: string): Observable<Carrito> { return this.http.get<Carrito>(`${this.baseUrl}/${id}`); }

  create(body: Carrito): Observable<Carrito> { return this.http.post<Carrito>(this.baseUrl, body); }

  update(id: string, body: Carrito): Observable<Carrito> { return this.http.put<Carrito>(`${this.baseUrl}/${id}`, body); }

  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
