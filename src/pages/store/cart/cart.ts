// src/pages/store/cart/cart.ts

// 🔹 Coste de envío fijo
const ENVIO_COSTO = 500;

// 🔹 Referencias al DOM
const carritoItems = document.getElementById("carrito-items") as HTMLElement;
const carritoVacio = document.getElementById("carrito-vacio") as HTMLElement;
const resumen = document.getElementById("carrito-resumen") as HTMLElement;
const subtotalEl = document.getElementById("subtotal") as HTMLElement;
const envioEl = document.getElementById("envio") as HTMLElement;
const totalEl = document.getElementById("total") as HTMLElement;
const btnVaciar = document.querySelector(".btn-vaciar") as HTMLButtonElement;
const btnPagar = document.querySelector(".btn-pago") as HTMLButtonElement;

// =============================
// 📦 Funciones auxiliares
// =============================

// Obtener carrito desde localStorage
function loadCart() {
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
}

// Guardar carrito en localStorage
function saveCart(cart: any[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Vaciar carrito
function clearCart() {
  localStorage.removeItem("cart");
}

// Calcular subtotal
function getCartSubtotal(cart: any[]): number {
  return cart.reduce((sum, item) => sum + item.cantidad * Number(item.precio), 0);
}

// =============================
// 🧩 Renderizado del carrito
// =============================
function renderCart() {
  const cart = loadCart();
  carritoItems.innerHTML = ""; // Limpia contenido previo

  if (cart.length === 0) {
    carritoVacio.style.display = "block";
    resumen.style.display = "none";
    return;
  }

  carritoVacio.style.display = "none";
  resumen.style.display = "block";

  cart.forEach((item:any) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add("carrito-item");
    itemEl.dataset.id = item.id;

    itemEl.innerHTML = `
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
      <hr>
    `;

    carritoItems.appendChild(itemEl);
  });

  actualizarTotales(cart);
}

// =============================
// 💰 Actualizar totales
// =============================
function actualizarTotales(cart: any[]) {
  const subtotal = getCartSubtotal(cart);
  const total = subtotal + ENVIO_COSTO;

  subtotalEl.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  envioEl.textContent = `Envío: $${ENVIO_COSTO.toFixed(2)}`;
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

// =============================
// 🧠 Listeners
// =============================

// Cambiar cantidad o eliminar producto
carritoItems.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const itemEl = target.closest(".carrito-item") as HTMLElement;
  if (!itemEl) return;

  const id = Number(itemEl.dataset.id);
  let cart = loadCart();

  // Eliminar producto
  if (target.classList.contains("delete-item")) {
    cart = cart.filter((p: any) => p.id !== id);
    saveCart(cart);
    renderCart();
    return;
  }

  // Aumentar o disminuir cantidad
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

// Cambiar cantidad manualmente
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

// Vaciar carrito
btnVaciar.addEventListener("click", () => {
  if (confirm("¿Vaciar el carrito?")) {
    clearCart();
    renderCart();
  }
});

// Proceder al pago (sin funcionalidad aún)
btnPagar.addEventListener("click", () => {
  alert("Funcionalidad de pago próximamente 🛍️");
});

// =============================
// 🚀 Inicialización
// =============================
document.addEventListener("DOMContentLoaded", renderCart);
