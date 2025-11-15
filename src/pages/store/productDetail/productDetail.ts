import { mostrarAlerta } from "../../../utils/alerts";
import type { IProduct } from "../../../types/IProduct";

// ===============================
// 🔍 Obtener producto desde el backend
// ===============================
async function obtenerProductoPorId(id: number): Promise<IProduct> {
  try {
    const response = await fetch(`http://localhost:8080/producto/${id}`);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const producto = await response.json();
    return producto;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    mostrarAlerta("No se pudo cargar el producto.");
    throw error;
  }
}

// ===============================
// 🛒 Funciones de carrito
// ===============================
function loadCart(): any[] {
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
}

function saveCart(cart: any[]): void {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(producto: IProduct, cantidad: number): void {
  const cart = loadCart();

  const existing = cart.find((item) => item.id === producto.id);

  if (existing) {
    existing.cantidad += cantidad;
    existing.stock = producto.stock;
  } else {
    cart.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      cantidad,
      stock: producto.stock
    });
  }

  saveCart(cart);
}

// ===============================
// 🖼️ Mostrar producto en pantalla
// ===============================
async function mostrarProducto() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  if (!id) {
    mostrarAlerta("❌ No se especificó un producto válido.");
    return;
  }

  const producto = await obtenerProductoPorId(id);
  console.log("PRODUCTO RECIBIDO DESDE BACKEND 👉", producto);

  (document.getElementById("productImage") as HTMLImageElement).src = producto.imagen;
  (document.getElementById("productImage") as HTMLImageElement).alt = producto.nombre;

  (document.getElementById("productTitle") as HTMLElement).textContent = producto.nombre;
  (document.getElementById("productPrice") as HTMLElement).textContent =
    `$${producto.precio.toLocaleString("es-AR")}`;
  (document.getElementById("productStatus") as HTMLElement).textContent =
    `Disponible (Stock: ${producto.stock})`;
  (document.getElementById("productDescription") as HTMLElement).textContent = producto.descripcion;

  // ===============================
  // ➕➖ Control de cantidad
  // ===============================
  const btnSumar = document.getElementById("sumar") as HTMLButtonElement;
  const btnRestar = document.getElementById("restar") as HTMLButtonElement;
  const inputCantidad = document.getElementById("cantidad") as HTMLInputElement;

  const stockMaximo = producto.stock;

  btnSumar.addEventListener("click", () => {
    let cantidad = Number(inputCantidad.value);
    if (cantidad < stockMaximo) {
      inputCantidad.value = String(cantidad + 1);
    }
  });

  btnRestar.addEventListener("click", () => {
    let cantidad = Number(inputCantidad.value);
    if (cantidad > 1) {
      inputCantidad.value = String(cantidad - 1);
    }
  });

  inputCantidad.addEventListener("input", () => {
    let cantidad = Number(inputCantidad.value);
    if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
    if (cantidad > stockMaximo) cantidad = stockMaximo;
    inputCantidad.value = String(cantidad);
  });

  // ===============================
  // 🛒 Agregar al carrito
  // ===============================
  const btnAgregar = document.getElementById("agregarCarrito") as HTMLButtonElement;

  btnAgregar.addEventListener("click", () => {
    const cantidad = Number(inputCantidad.value);

    if (cantidad < 1 || cantidad > stockMaximo) {
      mostrarAlerta("Cantidad no válida");
      return;
    }

    addToCart(producto, cantidad);
    mostrarAlerta(`🛒 ${producto.nombre} agregado al carrito (${cantidad})`);
  });
}

document.addEventListener("DOMContentLoaded", mostrarProducto);
