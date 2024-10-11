import { allProjects } from "./script.js";
const trash = "fa-trash-can";
export function modal() {
  const editionBtn = document.querySelector(".editionBtn");
  const modalContainer = document.querySelector(".modal-container");
  displayContent();
  editionBtn.addEventListener("click", () => {
    modalContainer.classList.remove("hidden");
  });
  const cross = document.querySelector(".fa-xmark");
  cross.addEventListener("click", () => {
    closeModal();
  });
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      closeModal();
    }
  });
}
function closeModal() {
  const modalContainer = document.querySelector(".modal-container");
  modalContainer.classList.add("hidden");
}
function displayContent() {
  const content = document.querySelector(".modal-content");
  allProjects.forEach((project) => {
    const container = document.createElement("div");
    container.classList.add("imageIconContainer");
    const image = document.createElement("img");
    image.src = project.imageUrl;
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-trash-can");

    container.appendChild(image);
    container.appendChild(icon);
    content.appendChild(container);
  });
}
