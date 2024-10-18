import {
  validateModalBtn,
  modalTitle,
  modalContent,
  goToAddWorkModal,
  manageModalDisplay,
} from "./modalRemoveWork.js";
import { callCategory, postWork, callWorks } from "./api.js";
import { displayProjectsHomePage } from "./script.js";
export const returnBtn = document.querySelector(".fa-arrow-left");
let selectedImageInputFile; // Déclaration en haut pour être accessible partout
let addWorkBtnListener;

export async function displayAddWorkModal() {
  validateModalBtn.removeEventListener("click", goToAddWorkModal);
  // Supprimer les anciens écouteurs d'événements avant d'en ajouter de nouveaux
  returnBtn.removeEventListener("click", handleReturnClick);
  returnBtn.classList.remove("visibilityHidden");
  returnBtn.addEventListener("click", handleReturnClick);

  modalTitle.innerHTML = "Ajout photo";
  validateModalBtn.innerHTML = "Valider";
  validateModalBtn.classList.add("modal-btn-disabled");

  modalContent.classList.remove("grid-modal-work");
  modalContent.innerHTML = ""; // Réinitialiser le contenu

  const containerInputFileImage = document.createElement("div");
  containerInputFileImage.classList.add("containerAddPhoto");

  const iconFaImage = document.createElement("i");
  iconFaImage.classList.add("fa-regular", "fa-image");

  const inputFile = document.createElement("input");
  inputFile.setAttribute("type", "file");
  inputFile.setAttribute("id", "file");
  inputFile.classList.add("hidden");

  const labelFile = document.createElement("label");
  labelFile.classList.add("labelFile");
  labelFile.setAttribute("for", "file");
  labelFile.innerHTML = "+ Ajouter photo";

  const acceptedFormatDescription = document.createElement("p");
  acceptedFormatDescription.innerHTML = "jpg, png : 4mo max";

  const inputTitleLabelContainer = document.createElement("div");
  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "workTitle");
  labelTitle.innerHTML = "Titre";

  const inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("id", "workTitle");

  const inputCategoriesContainer = document.createElement("div");
  const inputSelect = document.createElement("select");
  inputSelect.setAttribute("id", "categories");

  const categories = await callCategory();
  const labelSelect = document.createElement("label");
  labelSelect.setAttribute("for", "categories");
  labelSelect.innerHTML = "Catégorie";
  inputCategoriesContainer.appendChild(labelSelect);

  const emptyOption = document.createElement("option");
  inputSelect.appendChild(emptyOption);

  categories.forEach((category) => {
    const optionCategories = document.createElement("option");
    optionCategories.setAttribute("data-index", category.id);
    optionCategories.setAttribute("value", `${category.name}`);
    optionCategories.innerHTML = `${category.name}`;
    inputSelect.appendChild(optionCategories);
  });

  const containerInputs = document.createElement("div");
  containerInputs.classList.add("flex", "containerInputs");

  // Ajout des éléments au DOM
  modalContent.appendChild(containerInputFileImage);
  containerInputFileImage.appendChild(iconFaImage);
  containerInputFileImage.appendChild(inputFile);
  containerInputFileImage.appendChild(labelFile);
  containerInputFileImage.appendChild(inputTitle);

  inputTitleLabelContainer.appendChild(labelTitle);
  inputTitleLabelContainer.appendChild(inputTitle);

  modalContent.appendChild(inputTitleLabelContainer);
  inputCategoriesContainer.appendChild(inputSelect);
  modalContent.appendChild(inputCategoriesContainer);

  containerInputs.appendChild(inputTitleLabelContainer);
  containerInputs.appendChild(inputCategoriesContainer);
  modalContent.appendChild(containerInputs);

  manageInputFileDisplay(containerInputFileImage); // Ajoute le gestionnaire d'événements pour le fichier
  validateForm(inputTitle, inputSelect, inputFile); // Valide le formulaire
}

function manageInputFileDisplay(containerInputFileImage) {
  const fileInput = document.querySelector(".containerAddPhoto input");

  // Ajoute un écouteur sur le changement du fichier
  fileInput.addEventListener("change", (event) => {
    // Vérifie si un fichier est sélectionné
    selectedImageInputFile = event.target.files[0]; // Stocke le fichier sélectionné dans la variable globale

    if (selectedImageInputFile) {
      document.querySelector(".containerAddPhoto");
      const reader = new FileReader();

      // Définit la fonction à exécuter lorsque la lecture du fichier est terminée
      reader.onload = (e) => {
        const imageUrl = e.target.result; // Ne pas réutiliser selectedFiles ici
        containerInputFileImage.innerHTML = ""; // Efface le contenu
        const inputFile = document.createElement("input");
        inputFile.setAttribute("type", "file");
        inputFile.setAttribute("id", "file");
        inputFile.classList.add("hidden");

        const containerImageLabel = document.createElement("div");
        containerImageLabel.classList.add("containerImageLabel");
        const imageLoaded = document.createElement("img");
        imageLoaded.classList.add("imageLoad");
        imageLoaded.src = imageUrl; // Utilise le résultat du FileReader
        const labelImage = document.createElement("label");
        labelImage.setAttribute("for", "file");
        labelImage.classList.add("label-image");

        containerImageLabel.appendChild(imageLoaded);
        containerImageLabel.appendChild(labelImage);
        containerInputFileImage.appendChild(containerImageLabel);
        containerInputFileImage.appendChild(inputFile);

        manageInputFileDisplay(containerInputFileImage);
      };

      // Lit le fichier comme une URL de données
      reader.readAsDataURL(selectedImageInputFile);
    } else {
      console.log("Aucun fichier sélectionné");
    }
  });
}
async function validateForm(inputTitle, inputSelect, inputFile) {
  function checkValidation() {
    const isTitleFilled = inputTitle.value.trim() !== ""; // Vérifie si le titre est rempli
    const isCategorySelected = inputSelect.value !== ""; // Vérifie si une catégorie est sélectionnée
    const isImageSelected = inputFile.files.length > 0; // Vérifie si une image est sélectionnée
    // Si toutes les conditions sont remplies, activer le bouton de validation
    if (isTitleFilled && isCategorySelected && isImageSelected) {
      validateModalBtn.classList.remove("modal-btn-disabled");
      validateModalBtn.disabled = false;
      addWorkBtnListener = () =>
        handleAddWorkBtn(inputSelect, inputTitle, inputFile);
      validateModalBtn.addEventListener("click", addWorkBtnListener); // Ajoute l'écouteur
    } else {
      validateModalBtn.classList.add("modal-btn-disabled");
      validateModalBtn.disabled = true;
    }
  }
  inputTitle.addEventListener("input", checkValidation);
  inputSelect.addEventListener("change", checkValidation);
  inputFile.addEventListener("change", checkValidation);
}

async function handleAddWorkBtn(inputSelect, inputTitle, inputFile) {
  const selectedOption = inputSelect.options[inputSelect.selectedIndex];
  const categoryId = selectedOption.dataset.index;
  const response = await postWork(
    selectedImageInputFile,
    inputTitle.value,
    categoryId
  );
  if (response) {
    validateModalBtn.removeEventListener("click", addWorkBtnListener);
    clearInputs(inputSelect, inputTitle, inputFile);
    const newProjects = await callWorks();

    displayAddWorkModal();
    displayProjectsHomePage(newProjects);
  }
}

function clearInputs(inputSelect, inputTitle, inputFile) {
  const containerImageLabel = document.querySelector(".containerImageLabel");
  const imageLoaded = document.querySelector(".imageLoad");
  containerImageLabel.removeChild(imageLoaded);
  inputSelect.selectedIndex = -1;
  inputTitle.value = "";
  inputFile.value = "";
}
// Fonction pour gérer le retour
export function handleReturnClick() {
  modalContent.classList.add("overflowHidden");
  returnBtn.classList.add("visibilityHidden");
  validateModalBtn.classList.remove("modal-btn-disabled");
  validateModalBtn.disabled = false;
  manageModalDisplay();
}
