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
  const res = await fetch('http://localhost:8080/api/categorias');
  if (!res.ok) throw new Error('Error al obtener categorías');
  return res.json();
}

/* Método POST para crear una nueva categoría */
export async function crearCategoria(categoria: {
  nombre: string;
  descripcion: string;
  imagen: string;
}) {
  const res = await fetch('http://localhost:8080/api/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });
  if (!res.ok) throw new Error('Error al crear categoría');
  return res.json();
}