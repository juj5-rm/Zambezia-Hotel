const url = "https://q4l2x4sw-3000.use2.devtunnels.ms/";

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
