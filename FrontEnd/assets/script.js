// Function to retrieve all projects
async function callApiAll() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// Function to retrieve categories
async function callApiCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// Fonction pour afficher les projets, avec un paramètre categoryId pour filtrer
async function displayProjects(categoryId = null) {
  const projects = await callApiAll();
  const sectionGallery = document.querySelector(".gallery");
  sectionGallery.innerHTML = ""; // Vider la galerie avant de réafficher

  // Filtrer les projets par catégorie si categoryId est spécifié
  const filteredProjects = categoryId
    ? projects.filter((project) => project.categoryId === categoryId)
    : projects; // Si aucune catégorie n'est sélectionnée, afficher tous les projets

  // Afficher les projets
  filteredProjects.forEach((element) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = element.imageUrl;
    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = element.title;
    figure.appendChild(image);
    figure.appendChild(figcaption);
    sectionGallery.appendChild(figure);
  });
}

// Fonction pour afficher les boutons de catégories
async function displayCategories() {
  const categories = await callApiCategories();
  const navFilters = document.querySelector(".filter");

  // Créer le bouton "Tous" pour afficher tous les projets
  const buttonAll = document.createElement("button");
  buttonAll.innerHTML = "Tous";
  buttonAll.classList.add("button_active");
  buttonAll.setAttribute("data-id", "all"); // Attribut spécial pour "Tous"
  navFilters.appendChild(buttonAll);

  // Créer un bouton pour chaque catégorie
  categories.forEach((element) => {
    const buttonFilter = document.createElement("button");
    buttonFilter.innerHTML = element.name;
    buttonFilter.setAttribute("data-id", element.id); // Utiliser l'ID de la catégorie
    navFilters.appendChild(buttonFilter);
  });

  // Ajouter un gestionnaire d'événement pour tous les boutons de filtre
  const buttons = document.querySelectorAll(".filter button");
  buttons.forEach((element) => {
    element.addEventListener("click", (event) => {
      // Enlever la classe "button_active" de tous les boutons
      buttons.forEach((btn) => btn.classList.remove("button_active"));
      // Ajouter la classe "button_active" au bouton cliqué
      event.target.classList.add("button_active");

      // Récupérer l'ID de la catégorie à partir de l'attribut "data-id"
      const categoryId = event.target.getAttribute("data-id");

      // Si "Tous" est cliqué, afficher tous les projets, sinon filtrer par catégorie
      categoryId === "all"
        ? displayProjects() // Affiche tous les projets
        : displayProjects(parseInt(categoryId)); // Affiche les projets filtrés par catégorie
    });
  });
}

// Appeler les fonctions pour afficher les catégories et les projets initiaux
displayCategories();
displayProjects(); // Par défaut, afficher tous les projets
