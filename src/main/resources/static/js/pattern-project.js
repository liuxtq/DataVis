import { api } from "./pattern-data.js";
import { showChartLoading, hideChartLoading } from "./index.js";
async function initProjectGraph() {
  var dom = document.querySelector(".pattern-project-panel .chart");
  var myChart = echarts.init(dom);
  registerChart(myChart, "pattern-project");
  showChartLoading(myChart);
  // 获取数据
  const columns = await api.showColumns.getColumns();
  const { nodes, links } = convertColumnsToGraph(columns);
  hideChartLoading(myChart);
  const option = {
    tooltip: {
      formatter: function (params) {
        if (params.dataType === "node") {
          const categories = ["level-1", "level-2", "level-3"];
          const category = categories[params.data.category] || "属性";
          return `${category}: ${params.data.name}`;
        }
        return;
      },
    },
    legend: {
      data: ["level-1", "level-2", "level-3"],
      textStyle: { color: "#fff" },
      icon: "circle",
      type: "scroll",
      orient: "vertical",
      left: "5%",
      top: "10%",
      itemWidth: 10,
      itemHeight: 10,
    },
    animationDurationUpdate: 300,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        type: "graph",
        layout: "force",
        force: {
          repulsion: [50, 100], // 节点之间的斥力范围
          gravity: 0.1, // 节点受到的向中心的引力
          edgeLength: [10, 50], // 边的长度范围
          layoutAnimation: true,
        },
        roam: true,
        zoom: 1,
        // 限制画布缩放范围
        scaleLimit: {
          min: 0.5,
          max: 2,
        },
        // 控制节点不飞出画布
        center: ["50%", "50%"],
        focusNodeAdjacency: true,
        legendHoverLink: true,
        draggable: true,
        categories: [
          { name: "level-1", itemStyle: { color: "#72d3f9" } },
          { name: "level-2", itemStyle: { color: "#4185f7" } },
          { name: "level-3", itemStyle: { color: "#62abe1" } },
        ],
        data: nodes,
        links: links,
        lineStyle: {
          opacity: 0.5,
          width: 1.5,
          curveness: 0,
        },
        label: {
          show: true,
          position: "right",
          color: "#fff",
          fontSize: 12,
          formatter: function (params) {
            return params.data.name.length > 8
              ? params.data.name.substring(0, 8) + "..."
              : params.data.name;
          },
        },
        // 添加边界控制
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",
      },
    ],
  };

  myChart.setOption(option);

  // 监听图表大小变化
  window.addEventListener("resize", () => {
    myChart.resize();
    // 重新定位节点到中心
    myChart.setOption({
      series: [
        {
          center: ["50%", "50%"],
        },
      ],
    });
  });
}

function convertColumnsToGraph(columns) {
  const nodes = [];
  const links = [];
  const nodeMap = new Map();

  // 添加节点的辅助函数
  function addNode(name, category) {
    if (!nodeMap.has(name)) {
      const node = {
        name,
        category,
        value: name,
        // 根据层级逐渐减小节点大小
        symbolSize: Math.max(16 - category * 2, 6),
      };
      nodes.push(node);
      nodeMap.set(name, node);
    }
    return nodeMap.get(name);
  }

  columns.forEach((column) => {
    const parts = column.path.split(".");
    let previousNode = null;

    // 遍历路径中的每一部分，创建节点和连接
    parts.forEach((part, index) => {
      const currentNode = addNode(part, Math.min(index, 4)); // 限制category最大为4

      if (previousNode) {
        links.push({
          source: previousNode.name,
          target: currentNode.name,
        });
      }

      previousNode = currentNode;
    });
  });

  return { nodes, links };
}

// 初始化图表
document.addEventListener("DOMContentLoaded", initProjectGraph);
