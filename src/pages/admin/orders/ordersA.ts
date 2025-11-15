// src/pages/admin/orders/orders.ts

import { mostrarAlerta } from "../../../utils/alerts";


const listaPedidos = document.getElementById("lista-pedidos") as HTMLElement;
const filtroEstado = document.getElementById("filtro-estado") as HTMLSelectElement;

// Modal
const modal = document.getElementById("modal-pedido") as HTMLElement;
const cerrarModal = document.getElementById("cerrarModal") as HTMLElement;
const tituloPedido = document.getElementById("titulo-pedido") as HTMLElement;
const detallePedido = document.getElementById("detalle-pedido") as HTMLElement;
const nuevoEstado = document.getElementById("nuevo-estado") as HTMLSelectElement;
const btnActualizar = document.getElementById("btn-actualizar") as HTMLButtonElement;

let pedidosGlobal: any[] = [];
let pedidoSeleccionado: any = null;

// ===============================================================
// OBTENER PEDIDOS DEL BACKEND
// ===============================================================

async function cargarPedidos() {
  try {
    const response = await fetch("http://localhost:8080/api/pedidos");
    pedidosGlobal = await response.json();
    renderPedidos();
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
  }
}

// ===============================================================
// RENDERIZAR PEDIDOS (FILTRADOS)
// ===============================================================

function renderPedidos() {
  listaPedidos.innerHTML = "";

  const estadoFiltro = filtroEstado.value;

  const pedidosFiltrados =
    estadoFiltro === "TODOS"
      ? pedidosGlobal
      : pedidosGlobal.filter((p) => p.estado === estadoFiltro);

  pedidosFiltrados.forEach((pedido) => {
    const div = document.createElement("div");
    div.classList.add("card-pedido");

    const fecha = new Date(pedido.fecha).toLocaleString("es-AR");

    div.innerHTML = `
      <div class="pedido-card">
        <h3>Pedido #ORD-${pedido.id}</h3>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Cantidad de productos:</strong> ${pedido.detallePedidos.length}</p>
        <span class="badge estado-${pedido.estado.toLowerCase()}">${pedido.estado}</span>
        <p class="precio-total">$${pedido.total.toFixed(2)}</p>
      </div>
    `;

    div.addEventListener("click", () => abrirModal(pedido));
    listaPedidos.appendChild(div);
  });
}

// ===============================================================
// ABRIR MODAL DE DETALLE
// ===============================================================

function abrirModal(pedido: any) {
  pedidoSeleccionado = pedido;

  tituloPedido.textContent = `Detalle del Pedido #ORD-${pedido.id}`;

  // Datos de envío
  const info = pedido.infoEntrega || {
    direccion: "No informado",
    telefono: "No informado",
    metodoPago: "No informado",
    nota: "",
  };

  let html = `
    <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString("es-AR")}</p>

    <h3>📍 Información de Entrega</h3>
    <p><strong>Dirección:</strong> ${info.direccion}</p>
    <p><strong>Teléfono:</strong> ${info.telefono}</p>
    <p><strong>Método de pago:</strong> ${info.metodoPago}</p>
    ${info.nota ? `<p><strong>Nota:</strong> ${info.nota}</p>` : ""}

    <h3>🛒 Productos</h3>
  `;

  // Detalles de productos
  pedido.detallePedidos.forEach((d: any) => {
    html += `
      <div class="producto-detalle">
        <span>${d.producto.nombre} (x${d.cantidad})</span>
        <span>$${d.subtotal.toFixed(2)}</span>
      </div>
    `;
  });

  html += `
    <hr>
    <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
  `;

  detallePedido.innerHTML = html;

  nuevoEstado.value = pedido.estado;
  modal.style.display = "flex";
}

// ===============================================================
// CERRAR MODAL
// ===============================================================

cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
  //pedidoSeleccionado = null;
});

// ===============================================================
// ACTUALIZAR ESTADO (PUT)
// ===============================================================

btnActualizar.addEventListener("click", async () => {
  if (!pedidoSeleccionado) return;

  const id = pedidoSeleccionado.id;
  const estadoNuevo = nuevoEstado.value;

  try {
    const response = await fetch(`http://localhost:8080/api/pedidos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: estadoNuevo }),
    });

    if (!response.ok) throw new Error("Error al actualizar pedido");

    mostrarAlerta("✔ Estado actualizado correctamente");

    modal.style.display = "none";

    // Recargar pedidos
    await cargarPedidos();
  } catch (error) {
    console.error(error);
    mostrarAlerta("❌ No se pudo actualizar el pedido");
  }
});

// ===============================================================
// FILTRO
// ===============================================================

filtroEstado.addEventListener("change", renderPedidos);

// ===============================================================
// ELIMINAR PEDIDO (DELETE)
// ===============================================================

const btnEliminar = document.getElementById("btn-eliminar") as HTMLButtonElement;

btnEliminar.addEventListener("click", async () => {
  if (!pedidoSeleccionado) return;

  const confirmar = confirm(`¿Eliminar el pedido #${pedidoSeleccionado.id}?`);

  if (!confirmar) return;

  const id = pedidoSeleccionado.id;

  try {
    const response = await fetch(`http://localhost:8080/api/pedidos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Error al eliminar pedido");

    mostrarAlerta("🗑️ Pedido eliminado correctamente");

    modal.style.display = "none";

    await cargarPedidos();

  } catch (error) {
    console.error(error);
    mostrarAlerta("❌ No se pudo eliminar el pedido");
  }
});


// Inicializar
cargarPedidos();
