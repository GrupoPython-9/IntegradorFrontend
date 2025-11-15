import type { Producto } from "./IProducto";

export interface DetallePedido {
  id: number;
  cantidad: number;
  subtotal: number;
  producto: Producto;
}