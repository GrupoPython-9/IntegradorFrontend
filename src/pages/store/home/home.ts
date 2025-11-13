import { obtenerProductos } from "../../../utils/api";
import type { IProduct } from "../../../types/IProduct";

const grid = document.querySelector(".product-grid") as HTMLElement;
const filtroCategoria = document.getElementById("filtrarCategoria") as HTMLSelectElement;
const inputBuscar = document.getElementById("buscarProducto") as HTMLInputElement;
const ordenarPor = document.getElementById("ordenarPor") as HTMLSelectElement;
const contador = document.querySelector(".section-header span") as HTMLElement;

let productos: IProduct[] = [];
let productosFiltrados: IProduct[] = [];

async function cargarProductos() {
  const grid = document.querySelector('.product-grid') as HTMLElement;

  if (!grid) return;

  grid.innerHTML = '<p>Cargando productos...</p>';

  try {
    const productos: IProduct[] = await obtenerProductos();

    grid.innerHTML = '';

    productos.forEach((producto) => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      card.innerHTML = `
        
          <img src="${producto.imagen}" alt="${producto.nombre}" class="product-card__img" />
        <div class="product-card__body">
          <h3 class="product-card__title">${producto.nombre}</h3>
          <p class="product-card__description">${producto.descripcion}</p>

          <div class="product-card__footer">
            <span class="product-card__price">$${producto.precio}</span>
            
            <a href = "../productDetail/productDetail.html?id=${producto.id}">
              <span class="product-card__status">Disponible</span> </a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    grid.innerHTML = '<p>Error al cargar los productos.</p>';
  }
}


function renderProductos(lista: IProduct[]) {
  if (!grid) return;

  if (lista.length === 0) {
    grid.innerHTML = "<p>No hay productos disponibles.</p>";
    contador.textContent = "0 productos";
    return;
  }

  contador.textContent = `${lista.length} producto${lista.length > 1 ? "s" : ""}`;

  grid.innerHTML = lista
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.imagen}" alt="${p.nombre}" class="product-card__img" />
        <div class="product-card__body">
          <span class="product-card__category">Categoria no especificada</span>
          <h3 class="product-card__title">${p.nombre}</h3>
          <p class="product-card__description">${p.descripcion}</p>
          <div class="product-card__footer">
            <span class="product-card__price">$${p.precio.toFixed(2)}</span>
            <button class="btn-add-cart">Agregar al carrito</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

// 🔍 Filtrado por nombre y categoría
function aplicarFiltros() {
  const texto = inputBuscar.value.toLowerCase();
  const categoria = filtroCategoria.value;

  productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(texto);
    const coincideCategoria =  categoria ? false : true;
    return coincideNombre && coincideCategoria;
  });

  aplicarOrden();
}

// Ordenamiento
function aplicarOrden() {
  const criterio = ordenarPor.value;
  if (criterio === "nombre") {
    productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (criterio === "precioAsc") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (criterio === "precioDesc") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  }

  renderProductos(productosFiltrados);
}

// 🎯 Eventos
inputBuscar?.addEventListener("input", aplicarFiltros);
filtroCategoria?.addEventListener("change", aplicarFiltros);
ordenarPor?.addEventListener("change", aplicarOrden);

document.addEventListener("DOMContentLoaded", cargarProductos);
