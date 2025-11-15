import type { IProduct } from "./IProduct";

export interface ICategoria {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  productos?: IProduct;
}