import type { IUser } from "../types/IUser";
import type { IProduct } from "../types/IProduct";

const direccionUrl: string = "http://localhost:8080/usuario"

/* Metodo Get */
export const fetchGet = fetch(direccionUrl,{
    method:"GET",
})
    .then((res)=> res.json())
    .then((data) => console.log(data))


/* Metodo Post */
export const registrarUsuario = async (data: any) => {
  

  const response = await fetch(direccionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const result: IUser = await response.json();
  console.log(result);
  return result;
};

/* Fetch Login Validación */

const urlLogin: string = "http://localhost:8080/auth/login"

export const loginUsuario = async(data:IUser): Promise<IUser>=>{
  const response = await fetch(urlLogin, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  //const result = await response.text();
  const result: IUser = await response.json();
  console.log(result);
  return result;
}

/* Método GET para obtener todas las categorías */
export async function getCategorias() {
  const response = await fetch("http://localhost:8080/categorias");
  if (!response.ok) throw new Error("Error al obtener categorías");

  const data = await response.json();

  // ⚠️ El array real está en data.datos
  
  return data.datos;
}

/* Método POST para crear una nueva categoría */
export async function crearCategoria(categoria: {
  nombre: string;
  descripcion: string;
  imagen: string;
}) {
  const res = await fetch('http://localhost:8080/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });

  const text = await res.text(); // <--- Captura el texto bruto de la respuesta
  console.log("Respuesta del backend:", res.status, text);

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}: ${text}`);
  }

  return JSON.parse(text);
}
//Funcion para eliminar
export async function eliminarCategoria(id: number) {
  try {
    const response = await fetch(`http://localhost:8080/categorias/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok || data.estado !== 200) {
      throw new Error(data.mensaje || "Error al eliminar la categoría");
    }

    console.log("Respuesta del backend:", data.mensaje);
    return data;
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    throw error;
  }
}

/* Método PUT para actualizar categoría */
export async function editarCategoria(
  id: number,
  categoria: { nombre: string; descripcion: string; imagen: string }
) {
  const res = await fetch(`http://localhost:8080/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });

  const data = await res.json();

  if (!res.ok || data.estado !== 200) {
    throw new Error(data.mensaje || 'Error al actualizar la categoría');
  }

  return data;
}

//-------------------------------------------------------------------------------------------------------------------------
// ENDPOINTS PARA PRODUCTOS
//-------------------------------------------------------------------------------------------------------------------------

const urlProducto: string = "http://localhost:8080/producto"
// 🔹 Crear producto (POST)
export const crearProducto = async (data: Omit<IProduct, "id">) => {
  const response = await fetch(urlProducto, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error HTTP:", response.status, errorText);
    throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("Producto creado:", result);
  return result;
};

// 🔹 Obtener todos los productos (GET)
export const obtenerProductos = async (): Promise<IProduct[]> => {
  try {
    const res = await fetch(urlProducto);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const datos: IProduct[] = await res.json();
    return datos;
  } catch (err) {
    console.error("Error al obtener los productos:", err);
    throw err;
  }
};

// 🔹 Editar producto (PUT)
export const editarProductos = async (id: number, data: Partial<IProduct>) => {
  const response = await fetch(`${urlProducto}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  console.log("Producto actualizado:", result);
  return result;
};

// 🔹 Eliminar producto (DELETE) — opcional
export const eliminarProducto = async (id: number) => {
  const response = await fetch(`${urlProducto}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error HTTP ${response.status}: ${errorText}`);
  }
  const result = await response.text();
  return result;
};

export function mostrarAlerta(mensaje: string) {
  let alertBox = document.getElementById("custom-alert") as HTMLElement;

  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "custom-alert";
    alertBox.className = "alert";
    alertBox.innerHTML = `
      <span id="alert-message"></span>
      <button id="alert-close">Aceptar</button>
    `;
    document.body.appendChild(alertBox);
  }

  const alertMessage = document.getElementById("alert-message") as HTMLElement;
  const alertClose = document.getElementById("alert-close") as HTMLButtonElement;

  alertMessage.textContent = mensaje;
  alertBox.classList.remove("hidden");

  alertClose.onclick = () => {
    alertBox.classList.add("hidden");
  };

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 4000);
}

export function mostrarConfirmacion(mensaje: string, onConfirm: () => void) {
  let modal = document.getElementById("confirm-modal") as HTMLElement;

  // Si no existe, lo creamos dinámicamente
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "confirm-modal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <p id="confirm-message"></p>
        <div class="modal-buttons">
          <button id="confirm-accept" class="modal-btn-accept">Sí</button>
          <button id="confirm-cancel" class="modal-btn-cancel">Cancelar</button>
        </div>
      </div>
`;

    document.body.appendChild(modal);
  }

  const mensajeEl = document.getElementById("confirm-message") as HTMLElement;
  const btnAceptar = document.getElementById("confirm-accept") as HTMLButtonElement;
  const btnCancelar = document.getElementById("confirm-cancel") as HTMLButtonElement;

  mensajeEl.textContent = mensaje;
  modal.classList.remove("hidden");

  const cerrar = () => modal.classList.add("hidden");

  btnAceptar.onclick = () => {
    cerrar();
    onConfirm();
  };

  btnCancelar.onclick = cerrar;
}