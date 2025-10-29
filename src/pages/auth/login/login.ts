import { loginUsuario } from "../../../utils/api";

// Seleccionamos los campos correctos según el HTML
const email = document.getElementById("email") as HTMLInputElement;
const contrasenia = document.getElementById("password") as HTMLInputElement;
const form = document.querySelector("form") as HTMLFormElement;

// Escuchar el envío del formulario
form?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recargar la página

    // Crear el objeto con los valores ingresados
    const data = {
        email: email.value.trim(),
        contrasenia: contrasenia.value.trim(),
    };

    // Validación simple
    if (!data.email || !data.contrasenia) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        // Llamada al backend
        const response = await loginUsuario(data);
        console.log("Inicio de sesión correcto:", response);
        //Agregar luego verificacion por rol
        
        // Redirigir al home si todo está bien
        window.location.href = "../../client/home/home.html";
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Credenciales incorrectas o error de conexión.");
    }
});
