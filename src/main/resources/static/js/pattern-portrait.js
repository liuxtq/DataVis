import { api, dbTypeMap } from "./pattern-data.js";
import { showChartLoading, hideChartLoading } from "./index.js";
// MySQL图表 - 使用桑基图展示数据流向和关联
(async function () {
  var dom = document.querySelector(".pattern-portrait-mysql-panel .chart");
  var myChart = echarts.init(dom);
  registerChart(myChart, "pattern-portrait");
  showChartLoading(myChart);
  const treeData = await getDataByPath(dbTypeMap.relational);
  hideChartLoading(myChart);
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
})();

// IoTDB图表 - 使用饼图和时间轴展示时序特征
(async function () {
  var dom = document.querySelector(".pattern-portrait-iotdb-panel .chart");
  var myChart = echarts.init(dom);
  registerChart(myChart, "pattern-portrait");
  showChartLoading(myChart);
  const treeData = await getDataByPath(dbTypeMap.iotdb);
  hideChartLoading(myChart);

  const option = {
    title: {
      text: "",
      textStyle: { color: "#fff" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      height: "100%",
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c}",
    },
    legend: {
      orient: "horizontal",
      top: "left",
      textStyle: { color: "#fff" },
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          color: "#fff",
          formatter: function (params) {
            return params.name + "\n" + params.value + "个指标";
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "20",
            fontWeight: "bold",
          },
        },
        data: getSecondLastLevelNodes(treeData),
      },
    ],
  };
  myChart.setOption(option);
  //   window.addEventListener("resize", () => myChart.resize());
})();

// MongoDB图表 - 使用关系图展示文档间关系
(async function () {
  var dom = document.querySelector(".pattern-portrait-mongodb-panel .chart");
  var myChart = echarts.init(dom);
  registerChart(myChart, "pattern-portrait");
  showChartLoading(myChart);
  const treeData = await getDataByPath(dbTypeMap.mongodb);
  hideChartLoading(myChart);
  const option = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: [
      {
        type: "treemap",
        data: [treeData],
        levels: [
          {
            colorSaturation: [0.3, 0.6],
            itemStyle: {
              borderColorSaturation: 0.7,
              gapWidth: 2,
              borderWidth: 2,
            },
          },
          {
            colorSaturation: [0.3, 0.5],
            itemStyle: {
              borderColorSaturation: 0.6,
              gapWidth: 1,
            },
          },
          {
            colorSaturation: [0.3, 0.5],
          },
        ],
        upperLabel: {
          show: true,
          height: 30,
        },
      },
    ],
    visualMap: {
      min: 0,
      max: 50,
      inRange: {
        color: ["#2F93C8", "#35C5C5", "#35C56F", "#BAF659"], // 设置渐变色
      },
    },
  };
  myChart.setOption(option);
})();

// 文件系统图表 - 使用柱状图和饼图组合展示
(async function () {
  var dom = document.querySelector(".pattern-portrait-filesystem-panel .chart");
  var myChart = echarts.init(dom);
  registerChart(myChart, "pattern-portrait");
  showChartLoading(myChart);
  const treeData = await getDataByPath(dbTypeMap.filesystem);
  hideChartLoading(myChart);
  const fileTypes = getSecondLastLevelNodes(treeData);
  var option = {
    color: ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
      },
      // 显示children列表
      formatter: function (params) {
        const data = fileTypes[params[0].dataIndex];
        let result = `${data.name}: ${data.value}个<br/>`;
        data.children.forEach((child) => {
          result += `• ${child}<br/>`;
        });
        return result;
      },
    },
    legend: {
      // 距离容器10%
      right: "10%",
      // 修饰图例文字的颜色
      textStyle: {
        color: "#4c9bfd",
      },
    },
    grid: {
      height: "auto",
      left: "0%",
      top: "30px",
      right: "0%",
      bottom: "4%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: fileTypes.map((item) => item.name),
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        textStyle: {
          color: "rgba(255,255,255,.6)",
          fontSize: "12",
        },
      },
      axisLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        textStyle: {
          color: "rgba(255,255,255,.6)",
          fontSize: "12",
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,.1)",
          // width: 1,
          // type: "solid"
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,.1)",
        },
      },
    },
    series: [
      {
        type: "bar",
        // stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        data: fileTypes.map((item) => item.value),
        itemStyle: {
          barBorderRadius: 5,
        },
      },
    ],
  };

  myChart.setOption(option);
})();

// 初始化所有图表
let charts = [];

function initCharts() {
  // 清除现有图表
  charts.forEach((chart) => {
    if (chart && !chart.isDisposed()) {
      chart.dispose();
    }
  });
  charts = [];

  // 重新初始化所有图表
  if (document.getElementById("mysqlChart")) {
    charts.push(initMySQLChart());
  }
  if (document.getElementById("mongoChart")) {
    charts.push(initMongoChart());
  }
  if (document.getElementById("iotdbChart")) {
    charts.push(initIoTDBChart());
  }
  if (document.getElementById("comparisonChart")) {
    charts.push(initComparisonChart());
  }
  if (document.getElementById("fileSystemChart")) {
    charts.push(initFileSystemChart());
  }
}

// 页面加载完成后初始化
window.addEventListener("load", initCharts);

// 窗口大小改变时重绘图表
window.addEventListener("resize", function () {
  charts.forEach((chart) => {
    if (chart && !chart.isDisposed()) {
      chart.resize();
    }
  });
});

async function getDataByPath(path) {
  var columns = await api.showColumns.getColumns();

  columns = columns.filter((column) =>
    // column包含path数组中的任何一个元素
    path.some((p) => column.path.startsWith(p))
  );
  const treeData = generateTreeData(columns);
  return treeData;
}

function generateTreeData(columns) {
  var treeData = {
    name: "root",
    value: "root",
    children: [],
  };

  // 递归查找或创建节点
  function findOrCreateNode(parent, nodeName) {
    // 查找是否存在该节点
    let node = parent.children.find((child) => child.name === nodeName);
    if (!node) {
      // 如果不存在，创建新节点
      node = { name: nodeName, value: nodeName.length, children: [] };
      parent.children.push(node);
    }
    return node;
  }

  // 遍历 columns 数组，构建树结构
  columns.forEach((item) => {
    const pathParts = item.path.split(".");
    let currentLevel = treeData;

    // 遍历路径的每一部分
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentLevel = findOrCreateNode(currentLevel, part);
    }
  });

  // console.log(JSON.stringify(treeData, null, 2));
  return treeData;
}

// 将treeData的倒数第二级节点组成数组，数组的中的每个元素包括name和children的长度
function getSecondLastLevelNodes(treeData) {
  const result = [];

  function traverse(node) {
    // 如果当前节点有子节点
    if (node.children && node.children.length > 0) {
      // 如果子节点的子节点为空，说明当前节点是倒数第二级
      if (node.children.every((child) => child.children.length === 0)) {
        result.push({
          name: node.name,
          value: node.children.length,
          children: node.children.map((child) => child.name),
        });
      } else {
        // 否则继续递归遍历子节点
        node.children.forEach((child) => traverse(child));
      }
    }
  }

  // 从根节点开始遍历
  traverse(treeData);
  return result;
}

export { getDataByPath, generateTreeData };
