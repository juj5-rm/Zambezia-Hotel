const url = "http://localhost:3000/";

document.addEventListener("DOMContentLoaded", () => {
  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  fetchData();
});
