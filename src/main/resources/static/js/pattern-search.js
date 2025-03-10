import { api } from "./pattern-data.js";

document.addEventListener("DOMContentLoaded", function () {
  const sqlInput = document.getElementById("sql-input");
  const executeButton = document.getElementById("execute-query");
  const resultsTable = document.getElementById("query-results");

  // 分页配置
  let currentPage = 0;
  const pageSize = 2;
  let totalPages = 0;
  let currentSql = "";
  let currentHeaders = null;

  executeButton.addEventListener("click", async function () {
    const sql = sqlInput.value.trim();
    if (!sql) return;

    // 重置分页状态
    currentPage = 0;
    currentSql = sql;
    await fetchData();
  });

  async function fetchData() {
    try {
      showLoading();

      // 执行分页查询
      const response = await api.searchData.searchData({
        sql: currentSql,
        page: currentPage,
        pageSize: pageSize,
      });

      if (response && response.data && response.data.length > 0) {
        // 更新总页数
        totalPages = Math.ceil(response.total / pageSize);

        // 使用第一次查询的表头
        if (!currentHeaders && response.data.length > 0) {
          currentHeaders = response.data[0];
        }

        const dataRows = response.data.slice(1);
        //currentPage === 1 ? response.data.slice(1) : response.data;

        // 生成表头
        const thead = `
          <thead>
            <tr>
              ${Object.values(currentHeaders)
                .map((header) => `<th>${header}</th>`)
                .join("")}
            </tr>
          </thead>
        `;

        // 生成数据行
        const tbody = `
          <tbody>
            ${dataRows
              .map(
                (row) => `
              <tr>
                ${Object.values(row)
                  .map((value) => {
                    if (
                      typeof value === "string" &&
                      (value.endsWith(".png") ||
                        value.endsWith(".jpg") ||
                        value.endsWith(".jpeg"))
                    ) {
                      return `<td><img src="${value}" alt="图片" class="result-image"></td>`;
                    } else if (
                      typeof value === "string" &&
                      value.startsWith("http")
                    ) {
                      return `<td><a href="${value}" target="_blank" class="download-link">下载</a></td>`;
                    }
                    return `<td>${value}</td>`;
                  })
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        `;

        // 生成分页控件
        const pagination = `
          <div class="pagination">
            <button class="page-btn" ${
              currentPage === 1 ? "disabled" : ""
            } onclick="window.prevPage()">上一页</button>
            <span class="page-info">第 ${currentPage} 页 / 共 ${totalPages} 页</span>
            <button class="page-btn" ${
              currentPage === totalPages ? "disabled" : ""
            } onclick="window.nextPage()">下一页</button>
          </div>
        `;

        // 更新表格内容
        const container = document.createElement("div");
        container.className = "table-container";
        container.innerHTML = `
          <table>${thead}${tbody}</table>
          ${pagination}
        `;
        resultsTable.innerHTML = "";
        resultsTable.appendChild(container);
      } else {
        resultsTable.innerHTML = `
          <tr>
            <td colspan="100%" class="no-data">没有查询到数据</td>
          </tr>
        `;
      }
    } catch (error) {
      console.error("查询执行失败:", error);
      resultsTable.innerHTML = `
        <tr>
          <td colspan="100%" class="error-message">查询执行失败: ${error.message}</td>
        </tr>
      `;
    } finally {
      hideLoading();
    }
  }

  // 添加到window对象以便于在HTML中调用
  window.prevPage = async function () {
    if (currentPage > 1) {
      currentPage--;
      await fetchData();
    }
  };

  window.nextPage = async function () {
    if (currentPage < totalPages) {
      currentPage++;
      await fetchData();
    }
  };
});

// 显示加载状态
function showLoading() {
  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
  document.body.appendChild(loadingOverlay);
}

// 隐藏加载状态
function hideLoading() {
  const loadingOverlay = document.querySelector(".loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.remove();
  }
}
