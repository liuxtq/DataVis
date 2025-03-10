import { api } from "./pattern-data.js";

document.addEventListener("DOMContentLoaded", function () {
  const uploadBtn = document.getElementById("upload-btn");
  const fileInput = document.getElementById("image-upload");
  const searchBtn = document.getElementById("search-image-btn");
  const targetNameInput = document.getElementById("target-name-input");
  const resultTable = document
    .getElementById("image-result-table")
    .getElementsByTagName("tbody")[0];

  let currentImage = null;

  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      currentImage = file;
      targetNameInput.value = file.name.split(".")[0];
      try {
        const results = await api.imageSearch.queryImagesByUpload(file);
        displayResults(results);
      } catch (error) {
        console.error("搜索失败:", error);
      }
    }
  });

  searchBtn.addEventListener("click", async () => {
    const targetName = targetNameInput.value.trim();
    if (!targetName) {
      alert("请输入目标名称");
      return;
    }

    try {
      const results = await api.imageSearch.queryImages(targetName);
      displayResults(results);
    } catch (error) {
      console.error("搜索失败:", error);
    }
  });

  function displayResults(results) {
    resultTable.innerHTML = "";

    results.forEach((result) => {
      const row = resultTable.insertRow();

      const idCell = row.insertCell(0);
      const nameCell = row.insertCell(1);
      const imgCell = row.insertCell(2);
      const actionCell = row.insertCell(3);

      idCell.textContent = result.id;
      nameCell.textContent = result.targetName;

      const img = document.createElement("img");
      img.src = result.pngUrl;
      img.className = "thumbnail";
      imgCell.appendChild(img);

      const searchBtn = document.createElement("button");
      searchBtn.className = "search-btn";
      searchBtn.innerHTML = '<i class="fas fa-search"></i> 以图搜图';
      searchBtn.onclick = async () => {
        try {
          const newResults = await api.imageSearch.searchImageByUrl(
            result.pngUrl
          );
          displayResults(newResults);
        } catch (error) {
          console.error("搜索失败:", error);
        }
      };
      actionCell.appendChild(searchBtn);
    });
  }
});
