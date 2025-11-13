// src/pages/store/cart/cart.ts

import { mostrarAlerta } from "../../../utils/alerts";
import { mostrarConfirmacion } from "../../../utils/alerts";

const ENVIO_COSTO = 500;

const carritoItems = document.getElementById("carrito-items") as HTMLElement;
const carritoVacio = document.getElementById("carrito-vacio") as HTMLElement;
const resumen = document.getElementById("carrito-resumen") as HTMLElement;
const subtotalEl = document.getElementById("subtotal") as HTMLElement;
const envioEl = document.getElementById("envio") as HTMLElement;
const totalEl = document.getElementById("total") as HTMLElement;
const btnVaciar = document.querySelector(".btn-vaciar") as HTMLButtonElement;
const btnPagar = document.querySelector(".btn-pago") as HTMLButtonElement;

function loadCart() {
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
}

function saveCart(cart: any[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem("cart");
}

function getCartSubtotal(cart: any[]): number {
  return cart.reduce((sum, item) => sum + item.cantidad * Number(item.precio), 0);
}

function renderCart() {
  const cart = loadCart();
  carritoItems.innerHTML = "";

  if (cart.length === 0) {
    carritoVacio.style.display = "block";
    resumen.style.display = "none";
    return;
  }

  carritoVacio.style.display = "none";
  resumen.style.display = "block";

  cart.forEach((item: any) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add("carrito-item");
    itemEl.dataset.id = item.id;

    itemEl.innerHTML = `
      <div class= "item-nuevo">
      <div class="item-info">
        <h3>${item.nombre}</h3>
        <p>${item.descripcion || ""}</p>
        <p>Precio: $${Number(item.precio).toFixed(2)}</p>
      </div>
      <div class="item-actions">
        <button class="qty-btn" data-action="decrease">-</button>
        <input type="number" min="1" value="${item.cantidad}" class="qty-input" />
        <button class="qty-btn" data-action="increase">+</button>
        <span class="item-total">$${(item.cantidad * item.precio).toFixed(2)}</span>
        <button class="delete-item">🗑️</button>
      </div>
      </div>
      <hr>
    `;

    carritoItems.appendChild(itemEl);
  });

  actualizarTotales(cart);
}

function actualizarTotales(cart: any[]) {
  const subtotal = getCartSubtotal(cart);
  const total = subtotal + ENVIO_COSTO;

  subtotalEl.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  envioEl.textContent = `Envío: $${ENVIO_COSTO.toFixed(2)}`;
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

carritoItems.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const itemEl = target.closest(".carrito-item") as HTMLElement;
  if (!itemEl) return;

  const id = Number(itemEl.dataset.id);
  let cart = loadCart();

  if (target.classList.contains("delete-item")) {
    cart = cart.filter((p: any) => p.id !== id);
    saveCart(cart);
    renderCart();
    return;
  }

  if (target.classList.contains("qty-btn")) {
    const input = itemEl.querySelector(".qty-input") as HTMLInputElement;
    let cantidad = Number(input.value);

    if (target.dataset.action === "increase") cantidad++;
    else if (target.dataset.action === "decrease" && cantidad > 1) cantidad--;

    input.value = cantidad.toString();

    const index = cart.findIndex((p: any) => p.id === id);
    if (index !== -1) cart[index].cantidad = cantidad;

    saveCart(cart);
    renderCart();
  }
});

carritoItems.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  if (!target.classList.contains("qty-input")) return;

  const itemEl = target.closest(".carrito-item") as HTMLElement;
  if (!itemEl) return;

  const id = Number(itemEl.dataset.id);
  const nuevaCantidad = Math.max(1, Number(target.value));

  let cart = loadCart();
  const index = cart.findIndex((p: any) => p.id === id);
  if (index !== -1) cart[index].cantidad = nuevaCantidad;

  saveCart(cart);
  renderCart();
});

btnVaciar.addEventListener("click", () => {
  mostrarConfirmacion("¿Vaciar el carrito?", () => {
    clearCart();
    renderCart();
    mostrarAlerta("🗑️ Carrito vaciado");
  });
});

document.addEventListener("DOMContentLoaded", renderCart);

const modal = document.getElementById("modal-pedido") as HTMLElement;
const form = document.getElementById("form-pedido") as HTMLFormElement;
const cerrarModal = document.getElementById("cerrar-modal") as HTMLButtonElement;
const totalPagar = document.getElementById("total-pagar") as HTMLElement;

btnPagar.addEventListener("click", () => {
  const cart = loadCart();
  if (cart.length === 0) return;

  const subtotal = getCartSubtotal(cart);
  const total = subtotal + ENVIO_COSTO;
  totalPagar.textContent = `Total a pagar: $${total.toFixed(2)}`;
  modal.style.display = "flex";
});

cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cart = loadCart();
  const detallePedidos = cart.map((item: any) => ({
    cantidad: item.cantidad,
    subtotal: item.cantidad * item.precio,
    productoId: item.id, // ✅ Esto es lo que el backend espera
  }));

  const pedido = {
    detallePedidos,
    total: getCartSubtotal(cart) + ENVIO_COSTO,
    estado: "PENDIENTE",
  };

  try {
    const response = await fetch("http://localhost:8080/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });
    console.log(response);
    if (!response.ok) throw new Error("Error al crear el pedido");

    clearCart();
    modal.style.display = "none";
    mostrarAlerta("✅ Pedido confirmado");
    window.location.href = "../orders/orders.html";
  } catch (error) {
    mostrarAlerta("❌ No se pudo confirmar el pedido");
    console.error(error);
  }
});