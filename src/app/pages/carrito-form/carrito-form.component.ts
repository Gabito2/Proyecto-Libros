import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonBackButton,
  IonButton, IonButtons,
  IonContent,
  IonHeader, IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibroService } from '../../service/libro-service';
import { CarritoService } from '../../service/carrito-service';
import { Libro } from '../../model/libro';
import { Carrito, CarritoItem } from '../../model/carrito';
import {CurrencyPipe, NgFor} from "@angular/common";

@Component({
  selector: 'app-carrito-form',
  templateUrl: './carrito-form.component.html',
  styleUrls: ['./carrito-form.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonList,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    ReactiveFormsModule,
    CurrencyPipe,
    IonIcon,
    NgFor,
    IonBackButton,
    IonButtons
  ]
})
export class CarritoFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private carritoService = inject(CarritoService);
  private libroService = inject(LibroService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  libros = signal<Libro[]>([]);
  total = signal(0);

  form = this.fb.nonNullable.group({
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    customer: ['', Validators.required],
    items: this.fb.array([] as any[])
  });

  get items() {
    return this.form.get('items') as FormArray;
  }

  ngOnInit() {
    this.libroService.list().subscribe(ls => this.libros.set(ls));
    this.items;

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carritoService.getById(id).subscribe(c => {
        this.form.patchValue({
          date: c.date,
          customer: c.customer
        });
        c.items.forEach(it => this.items.push(this.makeItemGroup(it)));
        this.recalculateTotal();
      });
    } else {
      this.addItem();
    }

    this.items.valueChanges.subscribe(() => {
      this.recalculateTotal();
    });
  }

  makeItemGroup(it?: Partial<CarritoItem>) {
    return this.fb.nonNullable.group({
      productId: [it?.productId ?? null, Validators.required],
      name: [it?.name ?? ''],
      quantity: [it?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      unitPrice: [it?.unitPrice ?? 0, [Validators.required, Validators.min(0)]],
      subtotal: [it?.subtotal ?? 0]
    });
  }

  addItem() {
    this.items.push(this.makeItemGroup());
    this.recalculateTotal();
  }

  removeItem(i: number) {
    this.items.removeAt(i);
    this.recalculateTotal();
  }

  trackByIndex = (index: number) => index;

  onProductChange(i: number) {
    const g = this.items.at(i);
    const pid = g.get('productId')!.value as string | null;
    const libro = this.libros().find(x => x.id === pid);
    if (libro) {
      g.get('name')!.setValue(libro.titulo);
      g.get('unitPrice')!.setValue(libro.precio);
      this.recalc(i);
    }
  }

  recalc(i: number) {
    const g = this.items.at(i);
    const q = +g.get('quantity')!.value || 0;
    const u = +g.get('unitPrice')!.value || 0;
    const subtotal = q * u;
    g.get('subtotal')!.setValue(subtotal, { emitEvent: true });
    this.recalculateTotal();
  }

  private recalculateTotal() {
    const totalCalc = this.items.controls.reduce((acc, g) => {
      const subtotal = Number(g.get('subtotal')?.value) || 0;
      return acc + subtotal;
    }, 0);
    this.total.set(totalCalc);
  }

  save() {
    const raw = this.form.getRawValue();

    const payload: Carrito = {
      date: raw.date!,
      customer: raw.customer!,
      items: (raw.items as any[]).map(g => ({
        productId: g.productId,
        name: g.name,
        quantity: g.quantity,
        unitPrice: g.unitPrice,
        subtotal: g.subtotal
      })),
      total: this.total()
    };

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carritoService.update(id, payload).subscribe(() => this.router.navigate(['/carrito']));
    } else {
      this.carritoService.create(payload).subscribe(() => this.router.navigate(['/carrito']));
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
