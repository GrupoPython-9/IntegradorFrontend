import { fetchPost } from "../../../utils/api";

const nombre = document.getElementById("nombre") as HTMLInputElement;
const apellido = document.getElementById("apellido") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const celular = document.getElementById("celular") as HTMLInputElement;
const contrasenia = document.getElementById("contrasenia") as HTMLInputElement;
const form = document.querySelector("form") as HTMLFormElement;

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Crear el objeto con los valores del formulario
  const data = {
    nombre: nombre.value.trim(),
    apellido: apellido.value.trim(),
    email: email.value.trim(),
    celular: celular.value.trim(),
    contrasenia: contrasenia.value.trim(),
  };

  // Validación
  if (!data.nombre || !data.apellido || !data.email || !data.celular || !data.contrasenia) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    // Enviar datos al backend
    const response = await fetchPost(data);
    console.log("Usuario registrado correctamente:", response);

    // Redirigir al login si todo salió bien
    window.location.href = "../login/login.html";
  } catch (error) {
    console.error("Error al registrar:", error);
    alert("Ocurrió un error al registrar el usuario.");
  }
});
