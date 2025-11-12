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