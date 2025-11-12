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
  estado: string;
  total: number;
  detallePedidos: DetallePedido[];
}

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

function renderPedidos(pedidos: Pedido[]) {
  const container = document.getElementById("orders-list") as HTMLElement;
  container.innerHTML = "";

  if (pedidos.length === 0) {
    container.innerHTML = `<p>No hay pedidos registrados.</p>`;
    return;
  }

  pedidos.forEach((pedido) => {
    const card = document.createElement("div");
    card.classList.add("order-card");

    const productosHtml = pedido.detallePedidos
      .map((detalle) => {
        const producto = detalle.producto;
        return `
          <li>
            <strong>${producto.nombre}</strong> (x${detalle.cantidad})<br>
            Precio unitario: $${producto.precio.toFixed(2)}<br>
            Subtotal: $${detalle.subtotal.toFixed(2)}<br>
            ${producto.descripcion ? `<em>${producto.descripcion}</em>` : ""}
          </li>
        `;
      })
      .join("");

    card.innerHTML = `
      <h2>Pedido #${pedido.id}</h2>
      <p><strong>Fecha:</strong> ${pedido.fecha}</p>
      <p><strong>Estado:</strong> ${pedido.estado}</p>
      <div class="order-products">
        <strong>Productos:</strong>
        <ul>${productosHtml}</ul>
      </div>
      <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const pedidos = await fetchPedidos();
  renderPedidos(pedidos);
});