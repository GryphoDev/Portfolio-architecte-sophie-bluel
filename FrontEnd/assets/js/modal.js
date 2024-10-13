import { allProjects } from "./script.js";
import { callCategory } from "./api.js";
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
  const addBtn = document.querySelector(".modal-btn");
  addBtn.addEventListener("click", () => {
    addWork();
  });
}
function closeModal() {
  document.querySelector(".modal-container").classList.add("hidden");
}
function displayContent() {
  const content = document.querySelector(".modal-content");
  content.innerHTML = "";
  content.classList.add("grid-modal-work");
  document.querySelector(".modal-btn").innerHTML = "Ajouter une photo";
  document.querySelector(".modal-title").innerHTML = "Galerie photo";
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
async function addWork() {
  const returnBtn = document.querySelector(".fa-arrow-left");
  returnBtn.classList.remove("visibilityHidden");
  returnBtn.addEventListener("click", () => {
    returnBtn.classList.add("visibilityHidden");
    displayContent();
  });
  document.querySelector(".modal-title").innerHTML = "Ajout photo";
  document.querySelector(".modal-btn").innerHTML = "Valider";
  const content = document.querySelector(".modal-content");
  content.classList.remove("grid-modal-work");
  content.innerHTML = "";
  const containerAddPhoto = document.createElement("div");
  containerAddPhoto.classList.add("containerAddPhoto");
  const image = document.createElement("i");
  image.classList.add("fa-regular", "fa-image");
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("id", "file");
  input.classList.add("hidden");
  const labelFile = document.querySelector("label");
  labelFile.setAttribute("for", "file");
  labelFile.innerHTML = "+ Ajouter photo";
  const text = document.querySelector("p");
  text.innerHTML = "jpg, png : 4mo max";

  const inputContainerT = document.createElement("div");
  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "workTitle");
  labelTitle.innerHTML = "Titre";
  const inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("id", "workTitle");

  const inputContainerS = document.createElement("div");
  const select = document.createElement("select");
  select.setAttribute("id", "categories");
  const categories = await callCategory();
  const labelSelect = document.createElement("label");
  labelSelect.setAttribute("for", "categories");
  labelSelect.innerHTML = "Catégorie";
  inputContainerS.appendChild(labelSelect);
  const option = document.createElement("option");
  select.appendChild(option);
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.setAttribute("value", `${category.name}`);
    option.innerHTML = `${category.name}`;
    select.appendChild(option);
  });
  const containerInputs = document.createElement("div");
  containerInputs.classList.add("flex", "containerInputs");

  content.appendChild(containerAddPhoto);
  containerAddPhoto.appendChild(image);
  containerAddPhoto.appendChild(input);
  containerAddPhoto.appendChild(labelFile);
  containerAddPhoto.appendChild(text);
  inputContainerT.appendChild(labelTitle);
  inputContainerT.appendChild(inputTitle);
  content.appendChild(inputContainerT);
  inputContainerS.appendChild(select);
  content.appendChild(inputContainerS);
  containerInputs.appendChild(inputContainerT);
  containerInputs.appendChild(inputContainerS);
  content.appendChild(containerInputs);
}
