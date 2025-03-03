import { api } from "./pattern-data.js";
import { showChartLoading, hideChartLoading } from "./index.js";

// 数据源集成-接入数据源总数-仪表盘
(async function () {
  var dom = document.querySelector(
    ".pattern-extraction-datasource-calculate-panel .chart"
  );
  var myChart = echarts.init(dom);
  registerChart(myChart, "pattern-extraction");
  showChartLoading(myChart);
  const clusterInfo = await api.cluster.getClusterInfo();
  hideChartLoading(myChart);

  var option = {
    tooltip: {
      formatter: "{a} <br/>{b} : {c}%",
    },
    series: [
      {
        name: "接入数据源总数",
        type: "gauge",
        radius: "80%",
        center: ["50%", "50%"],
        progress: {
          show: true,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}",
          color: "#FFFFFF",
        },
        data: [
          {
            value: clusterInfo.storageEngineInfos.length,
            name: "数量",
          },
        ],
      },
    ],
  };

  myChart.setOption(option);

  // 注册图表实例
  window.registerChart(myChart);

  // 监听窗口大小变化
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();
// 数据源集成-模式提取属性统计仪表盘
(async function () {
  var myChart = echarts.init(
    document.querySelector(".pattern-extraction-datasource-column-panel .chart")
  );
  registerChart(myChart, "pattern-extraction");
  showChartLoading(myChart);
  const columns = await api.showColumns.getColumns();
  hideChartLoading(myChart);
  var option = {
    tooltip: {
      formatter: "{a} <br/>{b} : {c}%",
    },
    series: [
      {
        name: "模式提取属性统计",
        type: "gauge",
        radius: "80%",
        center: ["50%", "50%"],
        max: 300,
        progress: {
          show: true,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}",
          color: "#FFFFFF",
        },
        data: [
          {
            value: columns.length,
            name: "数量",
          },
        ],
      },
    ],
  };

  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();
// 数据源集成-柱状图
(async function () {
  // 实例化对象
  // var dom = document.querySelector(".pattern-extraction-datasource-calculate-panel .chart");
  var myChart = echarts.init(
    document.querySelector(".pattern-extraction-datasource-bar-panel .chart")
  );
  registerChart(myChart, "pattern-extraction");
  showChartLoading(myChart);
  const clusterInfo = await api.cluster.getClusterInfo();
  hideChartLoading(myChart);

  // 数据库类型映射表
  const dbTypeMap = {
    relational: "关系型数据库",
    mongodb: "MongoDB",
    iotdb12: "IotDB",
    filesystem: "文件系统",
  };
  // 获取数据源类型
  const map = new Map();
  clusterInfo.storageEngineInfos.forEach((node) => {
    map.set(dbTypeMap[node.type], (map.get(dbTypeMap[node.type]) || 0) + 1);
  });
  // 指定配置和数据
  var option = {
    color: ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
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
      // width: "80%",
      height: "auto",
      left: "0%",
      top: "0.375rem",
      right: "10%",
      bottom: "4%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Mysql", "MongoDB", "IotDB", "文件系统"],
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
        data: [
          map.get("关系型数据库"),
          map.get("MongoDB"),
          map.get("IotDB"),
          map.get("文件系统"),
        ],
        itemStyle: {
          barBorderRadius: 5,
        },
      },
    ],
  };
  // 把配置给实例对象
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();

// 模式提取图
(async function () {
  var dom = document.getElementById("pattern-extraction-circle");
  var myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  registerChart(myChart, "pattern-extraction");
  var option;
  showChartLoading(myChart);
  const columns = await api.showColumns.getColumns();
  console.log(columns);
  // columns转化成树型json
  function columnsToTree(columns) {
    // 初始化结果对象
    var result = {};

    // 遍历 columns 数组
    columns.forEach((item) => {
      // 按照 '.' 分割路径
      const pathParts = item.path.split(".");
      let currentLevel = result;

      // 遍历路径的每一部分
      pathParts.forEach((part, index) => {
        // 如果当前层级不存在，初始化为空对象
        if (!currentLevel[part]) {
          currentLevel[part] = { $count: index + 1 };
        }
        // 移动到下一级
        currentLevel = currentLevel[part];
      });
    });

    // 删除根节点 "root"
    if (result.root) {
      result = result.root;
    }
    return result;
  }
  // 初始化图表
  run(columnsToTree(columns));
  function run(rawData) {
    const dataWrap = prepareData(rawData);
    initChart(dataWrap.seriesData, dataWrap.maxDepth);
  }
  function prepareData(rawData) {
    const seriesData = [];
    let maxDepth = 0;
    function convert(source, basePath, depth) {
      if (source == null) {
        return;
      }
      if (maxDepth > 3) {
        return;
      }
      maxDepth = Math.max(depth, maxDepth);
      seriesData.push({
        id: basePath,
        value: source.$count,
        depth: depth,
        index: seriesData.length,
      });
      for (var key in source) {
        if (source.hasOwnProperty(key) && !key.match(/^\$/)) {
          var path = basePath + "." + key;
          convert(source[key], path, depth + 1);
        }
      }
    }
    convert(rawData, "root", 0);
    return {
      seriesData: seriesData,
      maxDepth: maxDepth,
    };
  }
  function initChart(seriesData, maxDepth) {
    var displayRoot = stratify();
    function stratify() {
      return d3
        .stratify()
        .parentId(function (d) {
          return d.id.substring(0, d.id.lastIndexOf("."));
        })(seriesData)
        .sum(function (d) {
          return d.value || 0;
        })
        .sort(function (a, b) {
          return b.value - a.value;
        });
    }
    function overallLayout(params, api) {
      var context = params.context;
      d3
        .pack()
        .size([api.getWidth() - 2, api.getHeight() - 2])
        .padding(3)(displayRoot);
      context.nodes = {};
      displayRoot.descendants().forEach(function (node, index) {
        context.nodes[node.id] = node;
      });
    }
    function renderItem(params, api) {
      var context = params.context;
      // Only do that layout once in each time `setOption` called.
      if (!context.layout) {
        context.layout = true;
        overallLayout(params, api);
      }
      var nodePath = api.value("id");
      var node = context.nodes[nodePath];
      if (!node) {
        // Reder nothing.
        return;
      }
      var isLeaf = !node.children || !node.children.length;
      var focus = new Uint32Array(
        node.descendants().map(function (node) {
          return node.data.index;
        })
      );
      var nodeName = isLeaf
        ? nodePath
            .slice(nodePath.lastIndexOf(".") + 1)
            .split(/(?=[A-Z][^A-Z])/g)
            .join("\n")
        : "";
      var z2 = api.value("depth") * 2;
      return {
        type: "circle",
        focus: focus,
        shape: {
          cx: node.x,
          cy: node.y,
          r: node.r,
        },
        transition: ["shape"],
        z2: z2,
        textContent: {
          type: "text",
          style: {
            // transition: isLeaf ? 'fontSize' : null,
            text: nodeName,
            fontFamily: "Arial",
            width: node.r * 1.3,
            overflow: "truncate",
            fontSize: node.r / 3,
            fill: "#000000", // 添加文字颜色
            align: "center", // 文字居中
            verticalAlign: "middle", // 垂直居中
          },
          emphasis: {
            style: {
              overflow: null,
              fontSize: Math.max(node.r / 3, 12),
            },
          },
        },
        textConfig: {
          position: "inside",
        },
        style: {
          fill: api.visual("color"),
        },
        emphasis: {
          style: {
            fontFamily: "Arial",
            fontSize: 12,
            shadowBlur: 20,
            shadowOffsetX: 3,
            shadowOffsetY: 5,
            shadowColor: "rgba(0,0,0,0.3)",
          },
        },
      };
    }
    hideChartLoading(myChart);
    option = {
      dataset: {
        source: seriesData,
      },
      legendHoverLink: true,
      legend: {
        // 距离容器10%
        right: "10%",
        // 修饰图例文字的颜色
        textStyle: {
          color: "#4c9bfd",
        },
        data: ["机场信息", "港口信息", "飞机信息", "船只信息", "传感器信息"],
      },

      tooltip: {},
      visualMap: [
        {
          show: false,
          min: 0,
          max: maxDepth,
          dimension: "depth",
          inRange: {
            color: ["#006edd", "#e0ffff"],
          },
        },
      ],
      hoverLayerThreshold: Infinity,
      series: {
        type: "custom",
        renderItem: renderItem,
        progressive: 0,
        coordinateSystem: "none",
        encode: {
          tooltip: "value",
          itemName: "id",
          value: "value",
        },
      },
    };
    // console.log(JSON.stringify(option));
    myChart.setOption(option);
    myChart.on("click", { seriesIndex: 0 }, function (params) {
      drillDown(params.data.id);
    });
    function drillDown(targetNodeId) {
      displayRoot = stratify();
      if (targetNodeId != null) {
        displayRoot = displayRoot.descendants().find(function (node) {
          return node.data.id === targetNodeId;
        });
      }
      // A trick to prevent d3-hierarchy from visiting parents in this algorithm.
      displayRoot.parent = null;
      myChart.setOption({
        dataset: {
          source: seriesData,
        },
      });
    }
    // Reset: click on the blank area.
    myChart.getZr().on("click", function (event) {
      if (!event.target) {
        drillDown();
      }
    });
  }

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
})();
