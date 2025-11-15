import type { IProduct } from "../../../types/IProduct";
import {
  obtenerProductos,
  crearProducto,
  editarProductos,
  eliminarProducto,
  getCategorias,
} from "../../../utils/api";
import type { ICategoria } from "../../../types/ICategoria";
import { mostrarAlerta } from "../../../utils/alerts";

// ───────────────────────────────
// Elementos del DOM
// ───────────────────────────────
const btnNuevoProducto = document.getElementById("btnNuevoProducto") as HTMLButtonElement;
const modalProducto = document.getElementById("modalProducto") as HTMLElement;
const formProducto = document.getElementById("formProducto") as HTMLFormElement;
const cerrarModal = document.getElementById("cerrarModal") as HTMLButtonElement;
const productosBody = document.getElementById("productosBody") as HTMLElement;

// Variable global temporal para saber si estamos editando o creando
let productoEnEdicion: IProduct | null = null;

// ───────────────────────────────
// Renderizar productos
// ───────────────────────────────
const renderProductos =(productos: IProduct[]) => {
  
  productosBody.innerHTML = "";

  productos.forEach((p) => {
    const row = document.createElement("tr");
    

    row.innerHTML = `
      <td>${p.id}</td>
      <td><img src="${p.imagen}" alt="${p.nombre}" class="imgTabla" width="60"></td>
      <td>${p.nombre}</td>
      <td>${p.descripcion}</td>
      <td>$${p.precio.toFixed(2)}</td>
      <td>-</td> <!-- categoría por ahora vacía -->
      <td>${p.stock}</td>
      <td>
        <label class="switch">
          <input type="checkbox" class="chk-estado" data-id= "checked" : ""}>
          <span class="slider round"></span>
        </label>
      </td>
      <td>
        <div class="acciones-container">
          <button class="btn btn-edit" data-id="${p.id}">Editar</button>
          <button class="btn btn-delete" data-id="${p.id}">Eliminar</button>
        </div>
      </td>
    `;

    productosBody.appendChild(row);
  });
};

// ───────────────────────────────
// Cargar productos desde la API
// ───────────────────────────────
const cargarProductos = async () => {
  try {
    const productos = await obtenerProductos();

    renderProductos(productos);
  } catch (error) {
    //console.error("Error al cargar productos:", error);
    mostrarAlerta(`Error al cargar productos: + ${error}`);
  }
};

//🔹 Función para cargar categorías en el select
const cargarCategoriasSelect = async () => {
  try {
    const categorias: ICategoria[] = await getCategorias();
    const select = document.getElementById("categoria") as HTMLSelectElement;

    // Limpiar opciones previas
    select.innerHTML = "";

    // Agregar opción por defecto
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccionar categoría";
    select.appendChild(defaultOption);

    // Agregar cada categoría
    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id.toString(); // Importante: el id
      option.textContent = cat.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    //console.error("Error al cargar categorías:", error);
    mostrarAlerta(`Error al cargar categorías: ${error}`);
  }
};

// ───────────────────────────────
// Abrir modal (nuevo o edición)
// ───────────────────────────────
const abrirModal = async (producto?: IProduct) => {
  await cargarCategoriasSelect();
  console.log("Se abrió el modal de producto", producto);
  modalProducto.style.display = "block";
  formProducto.reset();
  
  if (producto) {
    // Modo edición
    productoEnEdicion = producto;
    (document.getElementById("nombreProducto") as HTMLInputElement).value = producto.nombre;
    (document.getElementById("descripcionProducto") as HTMLInputElement).value = producto.descripcion;
    (document.getElementById("precioProducto") as HTMLInputElement).value = producto.precio.toString();
    (document.getElementById("stockProducto") as HTMLInputElement).value = producto.stock.toString();
    (document.getElementById("imagen") as HTMLInputElement).value = producto.imagen;

    //const selectCategoria = document.getElementById("categoria") as HTMLSelectElement;
    
    const title = modalProducto.querySelector("h2");
    if (title) title.textContent = "Editar Producto";
  } else {
    // Modo creación
    productoEnEdicion = null;
    const title = modalProducto.querySelector("h2");
    if (title) title.textContent = "Nuevo Producto";
  }
};

// ───────────────────────────────
// Cerrar modal
// ───────────────────────────────
const cerrarModalProducto = () => {
  modalProducto.style.display = "none";
  productoEnEdicion = null;
};

btnNuevoProducto.addEventListener("click", () => abrirModal());
cerrarModal.addEventListener("click", cerrarModalProducto);

window.addEventListener("click", (e) => {
  if (e.target === modalProducto) cerrarModalProducto();
});

// ───────────────────────────────
// Guardar producto (crear o editar)
// ───────────────────────────────
formProducto.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();

  const data = {
    nombre: (document.getElementById("nombreProducto") as HTMLInputElement).value,
    descripcion: (document.getElementById("descripcionProducto") as HTMLInputElement).value,
    precio: parseFloat((document.getElementById("precioProducto") as HTMLInputElement).value),
    stock: parseInt((document.getElementById("stockProducto") as HTMLInputElement).value),
    imagen: (document.getElementById("imagen") as HTMLInputElement).value,
    
  };

  try {
    if (productoEnEdicion) {
      await editarProductos(productoEnEdicion.id, data);
      //console.log("Producto actualizado");
      mostrarAlerta("Producto actualizado");
    } else {
      await crearProducto(data);
      //console.log("Producto creado");
      mostrarAlerta("Producto creado");
    }

    cerrarModalProducto();
    await cargarProductos();
  } catch (error) {
    //console.error("Error al guardar producto:", error);
    mostrarAlerta(`Error al guardar producto: ${error}`)
  }
});

// ───────────────────────────────
// Eventos en la tabla (editar, eliminar, toggle)
// ───────────────────────────────
productosBody.addEventListener("click", async (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const id = Number(target.dataset.id);

  // Eliminar 
  if (target.classList.contains("btn-delete")) {
    //
    const confirmDelete = confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmDelete) return;

    try {
        const productoActualizado = await eliminarProducto(id);
        //console.log(productoActualizado); // "Producto eliminado"
        mostrarAlerta(`${productoActualizado}`);
        await cargarProductos(); // recarga la tabla    
    } catch (err) {
      //console.error("Error al eliminar producto:", err);
      mostrarAlerta(`Error al eliminar el producto: ${err}`);
    }
  }

  // ✏️ Editar
  if (target.classList.contains("btn-update")) {
    try {
      const productos = await obtenerProductos();
      const producto = productos.find((p) => p.id === id);
      if (producto) abrirModal(producto);
    } catch (err) {
      //console.error("Error al obtener datos del producto:", err);
      mostrarAlerta(`Error al obtener datos del producto: ${err}`);
    }
  }
});

/*
// 🔄 Checkbox de estado
productosBody.addEventListener("change", async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.classList.contains("chk-estado")) return;

  const id = Number(target.dataset.id);
  const nuevoEstado = target.checked ? "activo" : "inactivo";

  try {
    await editarProductos(id, { estado: nuevoEstado });
    console.log(`Estado del producto ${id} cambiado a ${nuevoEstado}`);
  } catch (err) {
    console.error("Error al cambiar estado:", err);
    target.checked = !target.checked; // revertir si falla
  }
});
*/
// ───────────────────────────────
// Inicialización
// ───────────────────────────────
cargarProductos();
