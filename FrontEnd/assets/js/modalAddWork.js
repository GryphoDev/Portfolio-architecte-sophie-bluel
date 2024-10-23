import {
  validateModalBtn,
  modalTitle,
  modalContent,
  goToAddWorkModal,
  manageModalDisplay,
} from "./modalRemoveWork.js";
import { callCategory, postWork, callWorks } from "./api.js";
import { displayProjectsHomePage } from "./script.js";
import { displayAlert } from "./modalErrorMessage.js";
import { append } from "./utils.js";

export const returnBtn = document.querySelector(".fa-arrow-left");
let selectedImageInputFile;
let addWorkBtnListener;

export async function displayAddWorkModal() {
  // Remove previous event listeners
  validateModalBtn.removeEventListener("click", goToAddWorkModal);
  returnBtn.removeEventListener("click", handleReturnClick);
  // Show return button and set modal title and button text
  returnBtn.classList.remove("visibilityHidden");
  returnBtn.addEventListener("click", handleReturnClick);
  modalTitle.innerHTML = "Ajout photo";
  validateModalBtn.innerHTML = "Valider";
  validateModalBtn.classList.add("modal-btn-disabled");
  // Clear modal content and create elements for file input and title
  modalContent.classList.remove("grid-modal-work");
  modalContent.innerHTML = "";

  const containerInputFileImage = Object.assign(document.createElement("div"), {
    className: "containerAddPhoto",
  });
  const iconFaImage = Object.assign(document.createElement("i"), {
    className: "fa-regular fa-image",
  });
  const inputFile = Object.assign(document.createElement("input"), {
    type: "file",
    id: "file",
    className: "hidden",
  });
  const labelFile = Object.assign(document.createElement("label"), {
    innerHTML: "+ Ajouter photo",
    className: "labelFile",
  });
  labelFile.setAttribute("for", "file");

  const acceptedFormatDescription = Object.assign(document.createElement("p"), {
    innerHTML: "jpg, png : 4mo max",
  });
  const inputTitleLabelContainer = document.createElement("div");
  const labelTitle = Object.assign(document.createElement("label"), {
    innerHTML: "Titre",
  });
  labelTitle.setAttribute("for", "workTitle");
  const inputTitle = Object.assign(document.createElement("input"), {
    type: "text",
    id: "workTitle",
  });

  const inputCategoriesContainer = document.createElement("div");
  const inputSelect = Object.assign(document.createElement("select"), {
    id: "categories",
  });
  // Fetch categories for the dropdown
  const categories = await callCategory();
  const labelSelect = Object.assign(document.createElement("label"), {
    innerHTML: "Catégorie",
  });
  labelSelect.setAttribute("for", "categories");
  append(inputCategoriesContainer, [labelSelect]);
  // Create an empty option for the select
  const emptyOption = document.createElement("option");
  append(inputSelect, [emptyOption]);
  // Populate the select with category options
  categories.forEach((category) => {
    const optionCategories = Object.assign(document.createElement("option"), {
      innerHTML: category.name,
    });
    optionCategories.dataset.index = category.id;
    append(inputSelect, [optionCategories]);
  });
  // Create a container for inputs
  const containerInputs = Object.assign(document.createElement("div"), {
    className: "flex containerInputs",
  });
  // Append elements to the modal
  append(inputCategoriesContainer, [inputSelect]);
  append(containerInputFileImage, [
    iconFaImage,
    inputFile,
    labelFile,
    inputTitle,
    acceptedFormatDescription,
  ]);
  append(inputTitleLabelContainer, [labelTitle, inputTitle]);
  append(containerInputs, [inputTitleLabelContainer, inputCategoriesContainer]);
  append(modalContent, [containerInputFileImage, containerInputs]);
  // Manage file input display and validation
  manageInputFileDisplay(containerInputFileImage);
  validateForm(inputTitle, inputSelect, inputFile);
}

function manageInputFileDisplay(containerInputFileImage) {
  const fileInput = document.querySelector(".containerAddPhoto input");
  const validFormats = ["image/jpeg", "image/png"];
  const maxFileSize = 4 * 1024 * 1024;
  // Add event listener to handle file selection
  fileInput.addEventListener("change", (event) => {
    selectedImageInputFile = event.target.files[0];
    if (selectedImageInputFile) {
      if (!validFormats.includes(selectedImageInputFile.type)) {
        displayAlert("Le format de l'image doit être JPG ou PNG.");
        fileInput.value = "";
        return;
      }
      if (selectedImageInputFile.size > maxFileSize) {
        displayAlert("Votre image ne doit pas excéder 4 Mo.");
        fileInput.value = ""; // Reset file input
        return;
      }
      const reader = new FileReader();
      // Read and display the selected image
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        containerInputFileImage.innerHTML = "";
        const inputFile = Object.assign(document.createElement("input"), {
          type: "file",
          id: "file",
          className: "hidden",
        });
        const containerImageLabel = Object.assign(
          document.createElement("div"),
          {
            className: "containerImageLabel",
          }
        );
        const imageLoaded = Object.assign(document.createElement("img"), {
          src: imageUrl,
          className: "imageLoad",
        });
        const labelImage = Object.assign(document.createElement("label"), {
          className: "label-image",
        });
        labelImage.setAttribute("for", "file");
        append(containerImageLabel, [imageLoaded, labelImage]);
        append(containerInputFileImage, [containerImageLabel, inputFile]);
        manageInputFileDisplay(containerInputFileImage);
      };
      reader.readAsDataURL(selectedImageInputFile);
    } else {
      console.log("No file selected");
    }
  });
}

async function validateForm(inputTitle, inputSelect, inputFile) {
  function checkValidation() {
    const isTitleFilled = inputTitle.value.trim() !== ""; // Check if title is filled
    const isCategorySelected = inputSelect.value !== ""; // Check if category is selected
    const isImageSelected = inputFile.files.length > 0; // Check if an image is selected

    if (isTitleFilled && isCategorySelected && isImageSelected) {
      validateModalBtn.classList.remove("modal-btn-disabled");
      validateModalBtn.disabled = false;
      addWorkBtnListener = () =>
        handleAddWorkBtn(inputSelect, inputTitle, inputFile);
      validateModalBtn.addEventListener("click", addWorkBtnListener);
    } else {
      validateModalBtn.classList.add("modal-btn-disabled");
      validateModalBtn.disabled = true;
    }
  }
  // Add event listeners for validation checks
  inputTitle.addEventListener("input", checkValidation);
  inputSelect.addEventListener("change", checkValidation);
  inputFile.addEventListener("change", checkValidation);
}

async function handleAddWorkBtn(inputSelect, inputTitle, inputFile) {
  const selectedOption = inputSelect.options[inputSelect.selectedIndex];
  const categoryId = selectedOption.dataset.index;
  // Post the new work
  const response = await postWork(
    selectedImageInputFile,
    inputTitle.value,
    categoryId
  );
  if (!response) {
    displayAlert("Une erreur est survenue, veuillez réessayer.");
    displayAddWorkModal();
  }
  if (response) {
    displayAlert("Votre projet a été ajouté avec succès");
    validateModalBtn.removeEventListener("click", addWorkBtnListener);
    clearInputs(inputSelect, inputTitle, inputFile);
    // Refresh projects
    const newProjects = await callWorks();
    displayAddWorkModal();
    displayProjectsHomePage(newProjects);
  }
}

function clearInputs(inputSelect, inputTitle, inputFile) {
  const containerImageLabel = document.querySelector(".containerImageLabel");
  const imageLoaded = document.querySelector(".imageLoad");
  // Clear the input fields and reset the form
  containerImageLabel.removeChild(imageLoaded);
  inputSelect.selectedIndex = -1;
  inputTitle.value = "";
  inputFile.value = "";
}

export function handleReturnClick() {
  // Handle return button click
  modalContent.classList.add("overflowHidden");
  returnBtn.classList.add("visibilityHidden");
  validateModalBtn.classList.remove("modal-btn-disabled");
  validateModalBtn.disabled = false;
  manageModalDisplay();
}
