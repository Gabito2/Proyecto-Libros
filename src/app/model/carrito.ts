export interface CarritoItem {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Carrito {
    id?: number;
    date: string;
    customer: string;
    items: CarritoItem[];
    total: number;
}