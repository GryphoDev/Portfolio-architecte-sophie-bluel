import { displayProjectsHomePage } from "./script.js";
import { deleteProject, callWorks } from "./api.js";
import { displayAddWorkModal, handleReturnClick } from "./modalAddWork.js";
import { body } from "./logIn.js";
const editionBtnEditorPage = document.querySelector(".editionBtn");
export const modalContainer = document.querySelector(".modal-container");
export const modalContent = document.querySelector(".modal-content");
export const modalTitle = document.querySelector(".modal-title");
export const validateModalBtn = document.querySelector(".modal-btn");

export function manageModalDisplay() {
  displayContentModalRemoveWork(); // Appel initial pour afficher le contenu

  editionBtnEditorPage.addEventListener("click", () => {
    body.classList.remove("translateBottom");
    modalContainer.classList.remove("fastDisparition");
    modalContainer.classList.remove("hidden");
    modalContainer.classList.add("fastApparition");
    modalContent.classList.add("overflowHidden");
  });

  const closeModalBtn = document.querySelector(".fa-xmark");
  closeModalBtn.addEventListener("click", () => {
    closeModal();
  });

  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      closeModal();
    }
  });
  validateModalBtn.addEventListener("click", goToAddWorkModal);
}

export async function closeModal() {
  modalContainer.classList.remove("fastApparition");
  modalContainer.classList.add("fastDisparition");
  setTimeout(() => {
    modalContainer.classList.add("hidden");
    handleReturnClick();
  }, 200);
}

async function displayContentModalRemoveWork() {
  const newProjects = await callWorks();
  modalContent.innerHTML = ""; // Efface le contenu de la modale
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

    containerImageTrash.appendChild(image);
    containerImageTrash.appendChild(trashIcon);
    modalContent.appendChild(containerImageTrash);
  });
  const allTrash = document.querySelectorAll(".fa-trash-can");
  allTrash.forEach((trash) =>
    trash.addEventListener("click", async (e) => {
      const workId = e.currentTarget.dataset.index;
      await deleteProject(workId);
      displayContentModalRemoveWork();
      const newProjects = await callWorks();
      displayProjectsHomePage(newProjects);
    })
  );
}

export function goToAddWorkModal() {
  modalContent.classList.remove("overflowHidden");
  validateModalBtn.disabled = true;
  displayAddWorkModal();
}
