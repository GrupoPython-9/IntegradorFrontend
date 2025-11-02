import { loginUsuario } from "../../../utils/api";
import type { IUser } from "../../../types/IUser"

document.addEventListener("DOMContentLoaded", () =>{
// Seleccionamos los campos correctos según el HTML
const email = document.getElementById("email") as HTMLInputElement;
const contrasenia = document.getElementById("password") as HTMLInputElement;
const form = document.querySelector("form") as HTMLFormElement;

// Escuchar el envío del formulario
form?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recargar la página

    // Crear el objeto con los valores ingresados
    const data: IUser = {
        mail: email.value.trim(),
        contrasenia: contrasenia.value.trim(),
    };

    // Validación simple
    if (!data.mail || !data.contrasenia) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    
    try {
    const usuario = await loginUsuario(data);

    //probar los valores que llegan
    console.log("Usuario recibido:", usuario);
console.log("Rol recibido:", usuario.rol);

    console.log("Inicio de sesión correcto:", usuario);

    if (!usuario || !usuario.rol) {
      alert("Error: el servidor no devolvió un rol válido.");
      return;
    }

    

    // Guardamos el usuario en sesión
    sessionStorage.setItem("usuario", JSON.stringify(usuario));

    // Redirección según el rol
    if (usuario.rol.toUpperCase() === "ADMIN") {
      window.location.href = "../../admin/adminHome/adminHome.html";
    } else {
      window.location.href = "../../client/home/home.html";
    }

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Credenciales incorrectas o error de conexión.");
  }
})
});
