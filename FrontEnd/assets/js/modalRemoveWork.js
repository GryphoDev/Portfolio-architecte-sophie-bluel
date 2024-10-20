import { displayProjectsHomePage } from "./script.js";
import { deleteProject, callWorks } from "./api.js";
import { displayAddWorkModal, handleReturnClick } from "./modalAddWork.js";
import { body } from "./logIn.js";
import {
  displayConfirmationRemoveWork,
  closeModalError,
} from "./modalErrorMessage.js";
import { switchClass, append } from "./utils.js";

const editionBtnEditorPage = document.querySelector(".editionBtn");
export const modalContainer = document.querySelector(".modal-container");
export const modalContent = document.querySelector(".modal-content");
export const modalTitle = document.querySelector(".modal-title");
export const validateModalBtn = document.querySelector(".modal-btn");

// Manage modal display and content
export function manageModalDisplay() {
  displayContentModalRemoveWork();
  editionBtnEditorPage.addEventListener("click", () => {
    body.classList.remove("translateBottom");
    body.style.marginTop = "0";
    switchClass(
      [modalContainer],
      ["fastDisparition", "hidden"],
      ["fastApparition"]
    );
    modalContent.classList.add("overflowHidden");
  });
  const closeModalBtn = document.querySelector(".fa-xmark");
  closeModalBtn.addEventListener("click", closeModal);
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      closeModal();
    }
  });
  validateModalBtn.addEventListener("click", goToAddWorkModal);
}

// Close the modal
export async function closeModal() {
  switchClass([modalContainer], ["fastApparition"], ["fastDisparition"]);
  setTimeout(() => {
    modalContainer.classList.add("hidden");
    handleReturnClick();
  }, 200);
}

// Display content for removing work
async function displayContentModalRemoveWork() {
  const newProjects = await callWorks();
  modalContent.innerHTML = "";
  modalContent.classList.add("grid-modal-work");
  validateModalBtn.innerHTML = "Ajouter une photo";
  modalTitle.innerHTML = "Galerie photo";
  newProjects.forEach((project) => {
    const containerImageTrash = document.createElement("div");
    containerImageTrash.classList.add("imageIconContainer");
    const image = document.createElement("img");
    image.src = project.imageUrl;
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    trashIcon.setAttribute("data-index", project.id);
    append(containerImageTrash, [image, trashIcon]);
    modalContent.appendChild(containerImageTrash);
  });

  const allTrash = document.querySelectorAll(".fa-trash-can");
  allTrash.forEach((trash) =>
    trash.addEventListener("click", async (e) => {
      const workId = e.currentTarget.dataset.index;
      const response = await displayConfirmationRemoveWork();
      if (response === true) {
        await deleteProject(workId);
        displayContentModalRemoveWork();
        const newProjects = await callWorks();
        displayProjectsHomePage(newProjects);
        closeModalError();
      } else if (response === false) {
        closeModalError();
      }
    })
  );
}

// Go to the add work modal
export function goToAddWorkModal() {
  modalContent.classList.remove("overflowHidden");
  validateModalBtn.disabled = true;
  displayAddWorkModal();
}
