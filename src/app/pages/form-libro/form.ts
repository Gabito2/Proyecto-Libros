import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel,
  IonInput, IonButton, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { LibroService } from '../../service/libro-service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { Libro } from '../../model/libro';

@Component({
  selector: 'app-add',
  templateUrl: 'form.html',
  styleUrls: ['form.scss'],
  imports: [
    ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonList, IonItem, IonLabel,
    IonInput, IonButton, IonSelect, IonSelectOption
  ],
})
export class FormPage {

  private formbuilder = inject(FormBuilder);
  private service = inject(LibroService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: string | null = null;

  libro_form = this.formbuilder.nonNullable.group({
    titulo: ['', Validators.required],
    autor: ['', Validators.required],
    editorial: ['', Validators.required],
    fecha_publicacion: [new Date().toISOString().split('T')[0], Validators.required],
    genero: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    image_url: [''],
    favorito: [false],
    precio: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id && id !== 'new') {
          this.id = id;
          return this.service.getById(this.id);
        }
        this.id = null;
        return of(null);
      })
    ).subscribe(libro => {
      if (libro) {
        const libroConFechaString = {
          ...libro,
          fecha_publicacion: libro.fecha_publicacion
            ? new Date(libro.fecha_publicacion).toISOString().split('T')[0]
            : ''
        };
        this.libro_form.patchValue(libroConFechaString);
      }
    });
  }

  save() {
    if (this.libro_form.invalid) {
      this.libro_form.markAllAsTouched();
      return;
    }

    const raw = this.libro_form.getRawValue();

    const payload: Libro = {
      id: this.id ?? undefined,
      titulo: raw.titulo!,
      autor: raw.autor!,
      editorial: raw.editorial!,
      fecha_publicacion: new Date(raw.fecha_publicacion),
      genero: raw.genero!,
      stock: raw.stock!,
      image_url: raw.image_url!,
      favorito: raw.favorito!,
      precio: raw.precio!
    };

    const obs = this.id == null
      ? this.service.create(payload)
      : this.service.update(String(this.id), payload);

    obs.subscribe({
      next: () => this.router.navigateByUrl('/tabs/biblioteca'),
      error: (e) => alert(e.message)
    });
  }

  cancel() {
    this.router.navigateByUrl('/tabs/biblioteca');
  }

}
