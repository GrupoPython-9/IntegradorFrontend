interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
}

interface DetallePedido {
  id: number;
  cantidad: number;
  subtotal: number;
  producto: Producto;
}

interface Pedido {
  id: number;
  fecha: string;
  estado: "PENDIENTE"|"CONFIRMADO" | "CANCELADO" | "TERMINADO";
  total: number;
  direccionEntrega?: string;
  telefono?: string;
  metodoPago?: string;
  detallePedidos: DetallePedido[];
  infoEntrega?: InfoEntrega; 
}

interface InfoEntrega {
  direccion: string;
  telefono: string;
  metodoPago: string;
  nota?: string;
}

const modal = document.getElementById("modal-detalle") as HTMLElement;
const modalBody = document.getElementById("modal-body") as HTMLElement;
const closeModal = document.getElementById("close-modal") as HTMLElement;

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

async function fetchPedidos(): Promise<Pedido[]> {
  try {
    const response = await fetch("http://localhost:8080/api/pedidos");
    if (!response.ok) throw new Error("Error al obtener pedidos");
    return await response.json();
  } catch (error) {
    console.error("❌ Error al cargar pedidos:");
    return [];
  }
}

// 💡 badge según estado
function getBadgeClass(estado: string) {
  switch (estado) {
    case "PENDIENTE": return "badge-pendiente";
    case "EN_PROCESO": return "badge-proceso";
    case "ENTREGADO": return "badge-entregado";
    case "CANCELADO": return "badge-cancelado";
    default: return "";
  }
}

function renderPedidos(pedidos: Pedido[]) {
  const container = document.getElementById("orders-list") as HTMLElement;
  container.innerHTML = "";

  if (pedidos.length === 0) {
    container.innerHTML = `<p>No hay pedidos realizados.</p>`;
    return;
  }

  pedidos.forEach((pedido) => {
    const card = document.createElement("div");
    card.classList.add("pedido-card");

    const badgeClass = getBadgeClass(pedido.estado);

    card.innerHTML = `
      <h2>Pedido #ORD-${pedido.id}</h2>
      <p>${pedido.fecha}</p>
      <span class="badge ${badgeClass}">${pedido.estado}</span>

      <p><strong>${pedido.detallePedidos.length}</strong> producto(s)</p>

      <h3 class="pedido-total">$${pedido.total.toFixed(2)}</h3>
    `;

    // abrir modal
    card.addEventListener("click", () => abrirModalPedido(pedido));

    container.appendChild(card);
  });
}

function abrirModalPedido(pedido: Pedido) {
  const envio = 500;
  const subtotal = pedido.total - envio;

  const productosHtml = pedido.detallePedidos
    .map(
      (d) => `
      <div class="producto-modal">
        <p><strong>${d.producto.nombre}</strong></p>
        <p>Cantidad: ${d.cantidad}</p>
        <p class="precio-modal">$${d.subtotal.toFixed(2)}</p>
      </div>
    `
    )
    .join("");

  modalBody.innerHTML = `
    <div class="modal-header">
      <span class="badge ${getBadgeClass(pedido.estado)}">${pedido.estado}</span>
      <p>${pedido.fecha}</p>
    </div>

    <h3>📍 Información de Entrega</h3>
    <p><strong>Dirección:</strong> ${pedido.direccionEntrega || "No informado"}</p>
    <p><strong>Teléfono:</strong> ${pedido.telefono || "No informado"}</p>
    <p><strong>Método de pago:</strong> ${pedido.metodoPago || "No informado"}</p>

    <h3>🛒 Productos</h3>
    ${productosHtml}

    <div class="modal-totales">
      <p>Subtotal: <strong>$${subtotal.toFixed(2)}</strong></p>
      <p>Envío: <strong>$${envio.toFixed(2)}</strong></p>
      <hr>
      <p class="total-final">Total: <strong>$${pedido.total.toFixed(2)}</strong></p>
    </div>

    <div class="modal-nota">
      <p>📢 ${
        pedido.estado === "PENDIENTE"
          ? "Tu pedido está siendo procesado."
          : pedido.estado === "CONFIRMADO"
          ? "Tu pedido está en preparación."
          : pedido.estado === "TERMINADO"
          ? "Tu pedido fue completado."
          : "Pedido cancelado."
      }</p>
    </div>
  `;

  modal.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", async () => {
  const pedidos = await fetchPedidos();
  renderPedidos(pedidos);
});
