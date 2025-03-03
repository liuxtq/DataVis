import { api } from "./pattern-data.js";
document.addEventListener("DOMContentLoaded", function () {
  const executeBtn = document.getElementById("execute-query");
  const sqlInput = document.getElementById("sql-input");
  const resultsTable = document
    .getElementById("query-results")
    .getElementsByTagName("tbody")[0];

  executeBtn.addEventListener("click", function () {
    const sql = sqlInput.value.trim();
    if (!sql) {
      alert("请输入SQL查询语句");
      return;
    }
    const outfiles = api.outfiles.getOutFiles(sql);

    // 清空现有结果
    resultsTable.innerHTML = "";

    // 显示 mock 数据
    outfiles.forEach((result) => {
      const row = resultsTable.insertRow();

      const idCell = row.insertCell(0);
      const urlCell = row.insertCell(1);
      const timeCell = row.insertCell(2);

      idCell.textContent = result.id;
      urlCell.textContent = result.fileName;
      timeCell.textContent = result.filePath;
    });
  });
});
