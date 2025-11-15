import type { DetallePedido } from "./IDetallePedido";

export interface Pedido {
  id: number;
  fecha: string;
  estado: "PENDIENTE"|"CONFIRMADO" | "CANCELADO" | "TERMINADO";
  total: number;
  detallePedidos: DetallePedido[];
  infoEntrega?: {
    direccion: string;
    telefono: string;
    metodoPago: string;
    nota?: string;
  };
}