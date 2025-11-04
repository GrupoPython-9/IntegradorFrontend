import type { IUser } from "../types/IUser";

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