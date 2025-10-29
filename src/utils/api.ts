const direccionUrl: string = "http://localhost:8080/usuario"

/* Metodo Get */
export const fetchGet = fetch(direccionUrl,{
    method:"GET",
})
    .then((res)=> res.json())
    //.then((data) => console.log(data))


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

  const result = await response.json();
  console.log(result);
  return result;
};

/* Fetch Login Validación */

const urlLogin: string = "http://localhost:8080/auth/login"

export const loginUsuario = async(data:any)=>{
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

  const result = await response.text();
  console.log(result);
  return result;
}