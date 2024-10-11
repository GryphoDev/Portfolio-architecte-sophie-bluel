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
