import { api } from "./pattern-data.js";
document.addEventListener("DOMContentLoaded", async function () {
  const clusterTable = document
    .getElementById("cluster-info-table")
    .getElementsByTagName("tbody")[0];

  const storageTable = document
    .getElementById("storage-info-table")
    .getElementsByTagName("tbody")[0];

  const clusterInfo = await api.cluster.getClusterInfo();

  clusterInfo.iginxInfos.forEach((node) => {
    const row = clusterTable.insertRow();

    const idCell = row.insertCell(0);
    const ipCell = row.insertCell(1);
    const portCell = row.insertCell(2);

    idCell.textContent = node.id;
    ipCell.textContent = node.ip;
    portCell.textContent = node.port;
  });

  clusterInfo.storageEngineInfos.forEach((node) => {
    const row = storageTable.insertRow();

    const idCell = row.insertCell(0);
    const ipCell = row.insertCell(1);
    const portCell = row.insertCell(2);
    const typeCell = row.insertCell(3);

    idCell.textContent = node.id;
    ipCell.textContent = node.ip;
    portCell.textContent = node.port;
    typeCell.textContent = node.type;
  });
});
