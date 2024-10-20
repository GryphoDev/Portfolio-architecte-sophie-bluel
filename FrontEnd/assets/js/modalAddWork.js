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
  // Fetch categories for the dropdown
  const categories = await callCategory();
  const labelSelect = document.createElement("label");
  labelSelect.setAttribute("for", "categories");
  labelSelect.innerHTML = "Catégorie";
  inputCategoriesContainer.appendChild(labelSelect);
  // Create an empty option for the select
  const emptyOption = document.createElement("option");
  inputSelect.appendChild(emptyOption);
  // Populate the select with category options
  categories.forEach((category) => {
    const optionCategories = document.createElement("option");
    optionCategories.setAttribute("data-index", category.id);
    optionCategories.setAttribute("value", `${category.name}`);
    optionCategories.innerHTML = `${category.name}`;
    inputSelect.appendChild(optionCategories);
  });
  // Create a container for inputs
  const containerInputs = document.createElement("div");
  containerInputs.classList.add("flex", "containerInputs");
  // Append elements to the modal
  inputCategoriesContainer.appendChild(inputSelect);
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
  // Add event listener to handle file selection
  fileInput.addEventListener("change", (event) => {
    selectedImageInputFile = event.target.files[0];
    if (selectedImageInputFile) {
      const reader = new FileReader();
      // Read and display the selected image
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        containerInputFileImage.innerHTML = "";
        const inputFile = document.createElement("input");
        inputFile.setAttribute("type", "file");
        inputFile.setAttribute("id", "file");
        inputFile.classList.add("hidden");
        const containerImageLabel = document.createElement("div");
        containerImageLabel.classList.add("containerImageLabel");
        const imageLoaded = document.createElement("img");
        imageLoaded.classList.add("imageLoad");
        imageLoaded.src = imageUrl;
        const labelImage = document.createElement("label");
        labelImage.setAttribute("for", "file");
        labelImage.classList.add("label-image");
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
