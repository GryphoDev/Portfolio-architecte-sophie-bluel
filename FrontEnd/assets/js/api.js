export async function callWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}
export async function callCategory() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
export async function loginUser(email, password) {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  const data = await response.json();
  const token = data.token;
  return token;
}
export async function postWork(image, title, category) {
  const token = localStorage.getItem("authToken");

  // Création de l'objet FormData pour envoyer les données en multipart/form-data
  const formData = new FormData();
  formData.append("image", image); // Ajoute l'image au formData
  formData.append("title", title); // Ajoute le titre au formData
  formData.append("category", category); // Ajoute la catégorie au formData

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Ajout du token d'authentification
        // Ne pas ajouter de Content-Type ici. Fetch ajoute automatiquement le bon Content-Type (multipart/form-data)
      },
      body: formData, // Utilisation de FormData comme corps de la requête
    });
    if (response.ok) {
      return true;
    }
    if (!response.ok) {
      console.error("Erreur lors de l'ajout de l'œuvre:", response.statusText);
      return;
    }
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
  }
}

export async function deleteProject(projectId) {
  const token = localStorage.getItem("authToken");
  const url = `http://localhost:5678/api/works/${projectId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      console.log(`Project with ID ${projectId} deleted successfully.`);
    } else if (response.status === 401) {
      console.error("Unauthorized: Please check your token.");
    } else if (response.status === 500) {
      console.error("Internal Server Error: An unexpected error occurred.");
    } else {
      console.error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
