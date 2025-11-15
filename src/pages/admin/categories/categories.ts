import { eliminarCategoria, editarCategoria, getCategorias, crearCategoria } from '../../../utils/api';
import { mostrarAlerta } from '../../../utils/alerts';
import type { ICategoria } from '../../../types/ICategoria';

// 👉 Agrego esta variable global (sirve para saber si estamos editando)
let categoriaEnEdicion: ICategoria | null = null;

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

      // 🧹 Limpiar event listeners previos
      const nuevoTbody = tbody.cloneNode(true) as HTMLElement;
      tbody.parentNode?.replaceChild(nuevoTbody, tbody);

      // Y luego usamos `nuevoTbody` para agregar el listener
      nuevoTbody.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;

      // === Eliminar ===
      if (target.classList.contains('eliminar')) {
        const id = target.getAttribute('data-id');
        if (!id) return;
        
//Hay que mostrar el alerta para que no se vea el cartel blanco
        if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
        
        try {
          const response = await eliminarCategoria(Number(id));
          //alert(response.mensaje || 'Categoría eliminada correctamente');
          mostrarAlerta(response.mensaje || 'Categoría eliminada correctamente');
          cargarCategorias();
        } catch (error) {
          console.error('Error al eliminar categoría:', error);
          //alert('No se pudo eliminar la categoría');
          mostrarAlerta('No se pudo eliminar la categoría');
        }
      }

      // === Editar ===
      if (target.classList.contains('editar')) {
        const id = target.getAttribute('data-id');
        if (!id) return;

        const categoria = categorias.find((cat) => cat.id === Number(id));
        if (!categoria) return;

        categoriaEnEdicion = categoria; // Guardamos la categoría a editar

        const modal = document.getElementById('modalCategoria') as HTMLDivElement;
        (document.getElementById('nombreCategoria') as HTMLInputElement).value = categoria.nombre;
        (document.getElementById('descripcionCategoria') as HTMLInputElement).value = categoria.descripcion;
        (document.getElementById('imagen') as HTMLInputElement).value = categoria.imagen;

        modal.style.display = 'block';
      }
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
        categoriaEnEdicion = null; // limpiar estado
      }
    });
  }

  // Cerrar modal al hacer click fuera de él
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      form.reset();
      categoriaEnEdicion = null; // limpiar estado
    }
  });

  // Enviar formulario
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = (document.getElementById('nombreCategoria') as HTMLInputElement).value.trim();
      const descripcion = (document.getElementById('descripcionCategoria') as HTMLInputElement).value.trim();
      const imagen = (document.getElementById('imagen') as HTMLInputElement).value.trim();

      if (!nombre || !descripcion || !imagen) {
        //alert('Todos los campos son obligatorios');
        mostrarAlerta('Todos los campos son obligatorios')
        return;
      }

      try {
  if (categoriaEnEdicion) {

    await editarCategoria(categoriaEnEdicion.id, { nombre, descripcion, imagen });
    //alert('Categoría actualizada correctamente');
    mostrarAlerta('Categoría actualizada correctamente');
    categoriaEnEdicion = null; // limpiamos el estado de edición
  } else {
    await crearCategoria({ nombre, descripcion, imagen });
    //alert('Categoría creada exitosamente');
    mostrarAlerta('Categoría creada exitosamente');
  }

  modal.style.display = 'none';
  form.reset();
  cargarCategorias();

} catch (error) {
  console.error('Error al guardar categoría:', error);
  //alert('No se pudo guardar la categoría');
  mostrarAlerta('No se pudo guardar la categoría');
}

    });
  }
  
});