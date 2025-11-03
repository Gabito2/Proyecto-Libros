export interface Libro {
    id?: string;
    titulo: string;
    autor: string;
    editorial: string;
    fecha_publicacion: Date;
    genero: string;
    stock: number;
    image_url: string;
    favorito: boolean;
}
