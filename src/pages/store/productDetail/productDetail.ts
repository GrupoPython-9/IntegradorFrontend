// Esto está ahora para probar la carga de productos sin backend
// pero luego se debe descomentar e importar la función obtenerProductos desde utils/api.ts

// import { obtenerProductos } from '../../../utils/api';
// import type { IProduct } from '../../../types/IProduct';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  stock: number;
}

async function obtenerProductoPorId(id: number): Promise<Producto> {
  // Simulación de datos sin backend
  return {
    id,
    nombre: "Hamburguesa triple",
    precio: 25000,
    descripcion: "Hamburguesa triple smash",
    imagen: "../../../assets/hamburguesa.jpg",
    stock: 20,
  };

  // Para probar con el backend:
  /*
  const response = await fetch(`http://localhost:3000/api/productos/${id}`);
  return await response.json();
  */
}

async function mostrarProducto() {
  // Obtener el ID del producto desde la URL, ej: detalle.html?id=3
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  if (!id) {
    console.error("No se proporcionó un ID de producto");
    return;
  }

  const producto = await obtenerProductoPorId(id);

  // Insertar datos en el HTML
  (document.getElementById("productImage") as HTMLImageElement).src = producto.imagen;
  (document.getElementById("productImage") as HTMLImageElement).alt = producto.nombre;

  (document.getElementById("productTitle") as HTMLElement).textContent = producto.nombre;
  (document.getElementById("productPrice") as HTMLElement).textContent = `$${producto.precio.toLocaleString("es-AR")}`;
  (document.getElementById("productStatus") as HTMLElement).textContent = `Disponible (Stock: ${producto.stock})`;
  (document.getElementById("productDescription") as HTMLElement).textContent = producto.descripcion;

  // --- Lógica de botones de cantidad ---
  const btnSumar = document.getElementById("sumar") as HTMLButtonElement;
  const btnRestar = document.getElementById("restar") as HTMLButtonElement;
  const inputCantidad = document.getElementById("cantidad") as HTMLInputElement;
  const stockMaximo = producto.stock;

  // Sumar cantidad
  btnSumar.addEventListener("click", () => {
    let cantidad = parseInt(inputCantidad.value);
    if (cantidad < stockMaximo) {
      cantidad++;
      inputCantidad.value = cantidad.toString();
    }
  });

  // Restar cantidad
  btnRestar.addEventListener("click", () => {
    let cantidad = parseInt(inputCantidad.value);
    if (cantidad > 1) {
      cantidad--;
      inputCantidad.value = cantidad.toString();
    }
  });

  // Validar entrada manual
  inputCantidad.addEventListener("input", () => {
    let cantidad = parseInt(inputCantidad.value);
    if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
    if (cantidad > stockMaximo) cantidad = stockMaximo;
    inputCantidad.value = cantidad.toString();
  });
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", mostrarProducto);


