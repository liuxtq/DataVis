import { api, PatternData, dbTypeMap } from "./pattern-data.js";
import { getDataByPath, generateTreeData } from "./pattern-portrait.js";
document.addEventListener("DOMContentLoaded", async function () {
  const searchBtn = document.getElementById("search-btn");
  const patternSearch = document.getElementById("pattern-search");
  searchBtn.addEventListener("click", function () {
    let searchValue = patternSearch.value.trim();
    if (!searchValue) {
      searchValue = "*";
    }
    searchPattern(searchValue);
  });
});

async function searchPattern(searchValue) {
  var dom = document.querySelector(".pattern-puzzle-graph-panel .chart");
  var myChart = echarts.init(dom);
  registerChart(myChart, "pattern-puzzle");

  const columns = await api.showColumns.getColumns(searchValue);
  // 初始化表格数据
  const resultTable = document
    .getElementById("result-table")
    .getElementsByTagName("tbody")[0];
  resultTable.innerHTML = "";
  // console.log(Array.isArray(columns));
  columns.forEach((result) => {
    const row = resultTable.insertRow();
    const pathCell = row.insertCell(0);
    const typeCell = row.insertCell(1);

    pathCell.textContent = result.path;
    typeCell.textContent = result.type;
  });
  // 构建树状图数据
  const treeData = generateTreeData(columns);
  const option = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: [
      {
        type: "tree",
        data: [treeData],
        top: "18%",
        bottom: "14%",
        layout: "radial",
        symbol: "emptyCircle",
        symbolSize: 7,
        initialTreeDepth: 3,
        animationDurationUpdate: 750,
        emphasis: {
          focus: "descendant",
        },
        leaves: {
          label: {
            distance: 5,
            overflow: "truncate",
            formatter: function (params) {
              return params.name.length > 12
                ? params.name.slice(0, 12) + "..."
                : params.name;
            },
          },
        },
        label: {
          overflow: "truncate",
          formatter: function (params) {
            return params.name.length > 5
              ? params.name.slice(0, 5) + "..."
              : params.name;
          },
        },
      },
    ],
  };

  myChart.setOption(option);
  //   window.addEventListener("resize", () => myChart.resize());
}
