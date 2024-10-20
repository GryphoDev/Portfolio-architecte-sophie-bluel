// Fetches all works from the API
export async function callWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// Fetches all categories from the API
export async function callCategory() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// Authenticates the user and retrieves a token
export async function callLoginUser(email, password) {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data.token;
}

// Sends a new work to the API
export async function postWork(image, title, category) {
  const token = localStorage.getItem("authToken");
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (response.ok) return true;
    console.error("Error adding work:", response.statusText);
  } catch (error) {
    console.error("Request error:", error);
  }
}

// Deletes a project by ID
export async function deleteProject(projectId) {
  const token = localStorage.getItem("authToken");
  const url = `http://localhost:5678/api/works/${projectId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) return true;
  if (!response.ok) return false;
  console.error("Error deleting project:", response.statusText);
}
