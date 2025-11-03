import { getCategorias, crearCategoria } from '../../../utils/api';
import type { ICategoria } from '../../../types/ICategoria';

// Cargar categorías
async function cargarCategorias() {
  try {
    const categorias: ICategoria[] = await getCategorias();
    const tbody = document.getElementById('categoriasBody');

    if (!tbody) return;

    tbody.innerHTML = ''; // Limpiar tabla

    categorias.forEach((cat) => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td>${cat.id}</td>
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Cargar categorías
  cargarCategorias();

  // Obtener elementos del DOM
  const modal = document.getElementById('modalCategoria') as HTMLDivElement;
  const form = document.getElementById('formCategoria') as HTMLFormElement;
  const cerrarModal = document.getElementById('cerrarModal') as HTMLButtonElement;
  const btnNuevaCategoria = document.getElementById('btnNuevaCategoria') as HTMLButtonElement;

  // Debug - verificar que los elementos existan
  console.log('Modal:', modal);
  console.log('Botón:', btnNuevaCategoria);
  console.log('Form:', form);
  console.log('Cerrar:', cerrarModal);

  // Abrir modal
  if (btnNuevaCategoria) {
    btnNuevaCategoria.addEventListener('click', () => {
      console.log('¡Click en botón Nueva Categoría!');
      if (modal) {
        modal.style.display = 'block';
        console.log('Modal display:', modal.style.display);
      }
    });
  }

  // Cerrar modal
  if (cerrarModal) {
    cerrarModal.addEventListener('click', () => {
      console.log('Cerrando modal');
      if (modal) {
        modal.style.display = 'none';
        form.reset();
      }
    });
  }

  // Cerrar modal al hacer click fuera de él
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      form.reset();
    }
  });

  // Enviar formulario
  if (form) {
    form.addEventListener('submit', async (e) => {
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
        alert('Categoría creada exitosamente');
        modal.style.display = 'none';
        form.reset();
        cargarCategorias(); // Recargar la tabla
      } catch (error) {
        console.error('Error al crear categoría:', error);
        alert('No se pudo crear la categoría');
      }
    });
  }
});