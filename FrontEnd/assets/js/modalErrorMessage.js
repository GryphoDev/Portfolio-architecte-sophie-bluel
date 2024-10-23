import { append } from "./utils.js";

const modalError = document.querySelector(".error-message-modal");
const containerModalError = document.querySelector(
  ".container-error-message-modal"
);

export function displayConfirmationRemoveWork() {
  // Clear previous content and prepare the modal for a confirmation message
  modalError.innerHTML = "";
  return new Promise((resolve) => {
    containerModalError.classList.remove("hidden");
    // Set up confirmation message and button labels
    const message = Object.assign(document.createElement("p"), {
      innerHTML: "Êtes-vous sûr de vouloir supprimer cette photo ?",
    });
    const containerAllBtn = Object.assign(document.createElement("div"), {
      className: "containerAllBtn",
    });
    const btnConfirmation = Object.assign(document.createElement("button"), {
      innerHTML: "Supprimer",
    });
    const btnCancellation = Object.assign(document.createElement("button"), {
      innerHTML: "Annuler",
    });
    // Add class to button container and append buttons
    append(containerAllBtn, [btnConfirmation, btnCancellation]);
    append(modalError, [message, containerAllBtn]);
    // Resolve promise on button clicks
    btnConfirmation.addEventListener("click", () => {
      resolve(true); // User confirmed deletion
    });
    btnCancellation.addEventListener("click", () => {
      resolve(false); // User canceled deletion
    });
  });
}

export function displayAlert(alert) {
  // Display an alert message in the modal
  return new Promise((resolve) => {
    modalError.innerHTML = "";
    modalError.classList.add("modif-alert-message");
    containerModalError.classList.remove("hidden");
    const message = Object.assign(document.createElement("p"), {
      innerHTML: alert,
    });
    const iContainer = Object.assign(document.createElement("div"), {
      className: "iContainer",
    });
    const cross = Object.assign(document.createElement("i"), {
      className: "fa-solid fa-xmark",
    });
    append(iContainer, [cross]);
    append(modalError, [iContainer, message]);
    // Resolve promise when the close icon is clicked
    cross.addEventListener("click", () => {
      resolve(closeModalError());
    });
  });
}

export function closeModalError() {
  // Hide the error modal
  containerModalError.classList.add("hidden");
}
