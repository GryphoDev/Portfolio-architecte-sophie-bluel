import { fetchProjects } from "./script.js";
import { deleteProject, callCategory, postWork } from "./api.js";
const editionBtn = document.querySelector(".editionBtn");
const modalContainer = document.querySelector(".modal-container");
const addBtn = document.querySelector(".modal-btn");
const returnBtn = document.querySelector(".fa-arrow-left");
const content = document.querySelector(".modal-content");
const modalTitle = document.querySelector(".modal-title");

let selectedFiles; // Déclaration en haut pour être accessible partout

export function modal() {
  displayContent(); // Appel initial pour afficher le contenu

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
  addBtn.addEventListener("click", handleValidate);
}

async function closeModal() {
  modalContainer.classList.add("hidden");
  modal();
}

async function displayContent() {
  content.innerHTML = ""; // Efface le contenu de la modale
  content.classList.add("grid-modal-work");

  addBtn.innerHTML = "Ajouter une photo";
  modalTitle.innerHTML = "Galerie photo";
  const allProjects = await fetchProjects();
  allProjects.forEach((project) => {
    const container = document.createElement("div");
    container.classList.add("imageIconContainer");

    const image = document.createElement("img");
    image.src = project.imageUrl;

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-trash-can");
    icon.setAttribute("data-index", project.id);

    container.appendChild(image);
    container.appendChild(icon);
    content.appendChild(container);
  });
  const trash = document.querySelectorAll(".fa-trash-can");
  trash.forEach((trash) =>
    trash.addEventListener("click", async (e) => {
      const workId = e.target.dataset.index;
      await deleteProject(workId);
      displayContent();
    })
  );
}

async function displayAddWork() {
  addBtn.removeEventListener("click", handleValidate);
  // Supprimer les anciens écouteurs d'événements avant d'en ajouter de nouveaux
  returnBtn.removeEventListener("click", handleReturnClick);
  returnBtn.classList.remove("visibilityHidden");
  returnBtn.addEventListener("click", handleReturnClick);

  modalTitle.innerHTML = "Ajout photo";
  addBtn.innerHTML = "Valider";
  addBtn.classList.add("modal-btn-disabled");

  content.classList.remove("grid-modal-work");
  content.innerHTML = ""; // Réinitialiser le contenu

  const containerAddPhoto = document.createElement("div");
  containerAddPhoto.classList.add("containerAddPhoto");

  const image = document.createElement("i");
  image.classList.add("fa-regular", "fa-image");

  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("id", "file");
  input.classList.add("hidden");

  const labelFile = document.createElement("label");
  labelFile.classList.add("labelFile");
  labelFile.setAttribute("for", "file");
  labelFile.innerHTML = "+ Ajouter photo";

  const text = document.createElement("p");
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
    option.setAttribute("data-index", category.id);
    option.setAttribute("value", `${category.name}`);
    option.innerHTML = `${category.name}`;
    select.appendChild(option);
  });

  const containerInputs = document.createElement("div");
  containerInputs.classList.add("flex", "containerInputs");

  // Ajout des éléments au DOM
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

  addWork(); // Ajoute le gestionnaire d'événements pour le fichier
  validateForm(inputTitle, select, input); // Valide le formulaire
}

function addWork() {
  const fileInput = document.querySelector(".containerAddPhoto input");

  // Ajoute un écouteur sur le changement du fichier
  fileInput.addEventListener("change", (event) => {
    // Vérifie si un fichier est sélectionné
    selectedFiles = event.target.files[0]; // Stocke le fichier sélectionné dans la variable globale

    if (selectedFiles) {
      const container = document.querySelector(".containerAddPhoto");
      const reader = new FileReader();

      // Définit la fonction à exécuter lorsque la lecture du fichier est terminée
      reader.onload = (e) => {
        const imageUrl = e.target.result; // Ne pas réutiliser selectedFiles ici
        container.innerHTML = ""; // Efface le contenu
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("id", "file");
        input.classList.add("hidden");

        const containerImageLabel = document.createElement("div");
        containerImageLabel.classList.add("containerImageLabel");
        const imageLoad = document.createElement("img");
        imageLoad.classList.add("imageLoad");
        imageLoad.src = imageUrl; // Utilise le résultat du FileReader
        const labelImage = document.createElement("label");
        labelImage.setAttribute("for", "file");
        labelImage.classList.add("label-image");

        containerImageLabel.appendChild(imageLoad);
        containerImageLabel.appendChild(labelImage);
        container.appendChild(containerImageLabel);
        container.appendChild(input);
      };

      // Lit le fichier comme une URL de données
      reader.readAsDataURL(selectedFiles);
    } else {
      console.log("Aucun fichier sélectionné");
    }
  });
}
let clickHandler;
async function validateForm(inputTitle, select, input) {
  function checkValidation() {
    const isTitleFilled = inputTitle.value.trim() !== ""; // Vérifie si le titre est rempli
    const isCategorySelected = select.value !== ""; // Vérifie si une catégorie est sélectionnée
    const isImageSelected = input.files.length > 0; // Vérifie si une image est sélectionnée
    // Si toutes les conditions sont remplies, activer le bouton de validation
    if (isTitleFilled && isCategorySelected && isImageSelected) {
      addBtn.classList.remove("modal-btn-disabled");
      addBtn.disabled = false;
      clickHandler = () => handleAddWorkBtn(select, inputTitle, input);
      addBtn.addEventListener("click", clickHandler); // Ajoute l'écouteur
    } else {
      addBtn.classList.add("modal-btn-disabled");
      addBtn.disabled = true;
    }
  }
  inputTitle.addEventListener("input", checkValidation);
  select.addEventListener("change", checkValidation);
  input.addEventListener("change", checkValidation);
}

async function handleAddWorkBtn(select, title, input) {
  const selectedOption = select.options[select.selectedIndex];
  const categoryId = selectedOption.dataset.index;
  const response = await postWork(selectedFiles, title.value, categoryId);
  if (response) {
    clearInputs(select, title, input);
    addBtn.removeEventListener("click", clickHandler);
    closeModal(); // Fermer la modale après soumission
  }
}

function clearInputs(select, title, input) {
  const containerImageLabel = document.querySelector(".containerImageLabel");
  const imageLoad = document.querySelector(".imageLoad");
  containerImageLabel.removeChild(imageLoad);
  select.selectedIndex = -1;
  title.value = "";
  input.value = "";
}
// Fonction pour gérer le retour
function handleReturnClick() {
  returnBtn.classList.add("visibilityHidden");
  addBtn.classList.remove("modal-btn-disabled");
  addBtn.disabled = false;
  modal();
}

function handleValidate() {
  addBtn.disabled = true;
  displayAddWork();
}
