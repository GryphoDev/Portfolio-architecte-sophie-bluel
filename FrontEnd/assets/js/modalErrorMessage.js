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
    const message = document.createElement("p");
    const containerAllBtn = document.createElement("div");
    const btnConfirmation = document.createElement("button");
    const btnCancellation = document.createElement("button");
    // Set up confirmation message and button labels
    message.innerHTML = "Êtes-vous sûr de vouloir supprimer cette photo ?";
    btnConfirmation.innerHTML = "Supprimer";
    btnCancellation.innerHTML = "Annuler";
    // Add class to button container and append buttons
    containerAllBtn.classList.add("containerAllBtn");
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
    const message = document.createElement("p");
    const iContainer = document.createElement("div");
    iContainer.classList.add("iContainer");
    const cross = document.createElement("i");
    cross.classList.add("fa-solid", "fa-xmark");
    // Set alert message
    message.innerHTML = alert;
    iContainer.appendChild(cross);
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
