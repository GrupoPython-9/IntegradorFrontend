export interface IProduct {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
    imagen: string;
    estado?: string; // "activo" | "inactivo"
    categoria?: string | number;
}