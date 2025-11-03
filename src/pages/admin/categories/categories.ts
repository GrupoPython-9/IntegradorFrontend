import { getCategorias } from '../../../utils/api';
import type { ICategoria } from '../../../types/ICategoria';

async function cargarCategorias() {
  try {
    const categorias: ICategoria[] = await getCategorias();
    const tbody = document.getElementById('categoriasBody');

    if (!tbody) return;

    tbody.innerHTML = ''; // Limpiar tabla

    categorias.forEach((cat) => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td><img src="${cat.imagen}" alt="${cat.nombre}" width="50" /></td>
        <td>${cat.nombre}</td>
        <td>${cat.descripcion}</td>
        <td>
          <button class="editar" data-id="${cat.id}">Editar</button>
          <button class="eliminar" data-id="${cat.id}">Eliminar</button>
        </td>
      `;

      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
});

import { crearCategoria } from '../../../utils/api';

const modal = document.getElementById('modalCategoria') as HTMLDivElement;
const form = document.getElementById('formCategoria') as HTMLFormElement;
const cerrarModal = document.getElementById('cerrarModal');
const btnNuevaCategoria = document.getElementById('btnNuevaCategoria');

// Mostrar el modal
btnNuevaCategoria?.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Cerrar el modal
cerrarModal?.addEventListener('click', () => {
  modal.style.display = 'none';
  form.reset();
});

// Enviar el formulario
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
  const descripcion = (document.getElementById('descripcion') as HTMLInputElement).value.trim();
  const imagen = (document.getElementById('imagen') as HTMLInputElement).value.trim();

  if (!nombre || !descripcion || !imagen) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    await crearCategoria({ nombre, descripcion, imagen });
    modal.style.display = 'none';
    form.reset();
    cargarCategorias(); // Recarga la tabla con la nueva categoría
  } catch (error) {
    console.error('Error al crear categoría:', error);
    alert('No se pudo crear la categoría');
  }
});