//esto está ahora para probar la carga de productos sin backend
//pero luego se debe descomentar e importar la función obtenerProductos desde utils/api.ts

// import { obtenerProductos } from '../../../utils/api';
// import type { IProduct } from '../../../types/IProduct';

interface IProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoriaId: number;
}

async function cargarProductos() {
  const grid = document.querySelector('.product-grid') as HTMLElement;

  if (!grid) return;

  grid.innerHTML = '<p>Cargando productos...</p>';

  try {
    const productos: IProduct[] = [
      {
        id: 1,
        nombre: 'Pizza Napolitana',
        descripcion: 'Clásica pizza con tomate, mozzarella y albahaca.',
        precio: 2500,
        imagen: 'https://via.placeholder.com/250x180?text=Pizza+Napolitana',
        categoriaId: 1,
      },
      {
        id: 2,
        nombre: 'Hamburguesa Doble',
        descripcion: 'Con queso cheddar, panceta y salsa especial.',
        precio: 3100,
        imagen: 'https://via.placeholder.com/250x180?text=Hamburguesa+Doble',
        categoriaId: 2,
      },
    ];

    grid.innerHTML = ''; 

    productos.forEach((producto) => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="product-card__img" />
        <div class="product-card__body">
        <span class="product-card__category">Categoría ${producto.categoriaId}</span>
        <h3 class="product-card__title">${producto.nombre}</h3>
        <p class="product-card__description">${producto.descripcion}</p>

        <div class="product-card__footer">
          <span class="product-card__price">$${producto.precio.toFixed(2)}</span>
          <span class="product-card__status">Disponible</span>
        </div>
        </div>
      `;

      card.addEventListener('click', () => {
    // Redirige a la página del producto (ajustá la ruta según tu estructura)
     window.location.href = `../productDetail/productDetail.html?id=${producto.id}`;
     });

      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    grid.innerHTML = '<p>Error al cargar los productos.</p>';
  }
}

document.addEventListener('DOMContentLoaded', cargarProductos);
