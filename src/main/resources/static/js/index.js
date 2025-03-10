// 菜单展开收起和页面切换逻辑
(function () {
  const menu = document.querySelector(".menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainbox = document.querySelector(".mainbox");
  const panels = {
    "pattern-extraction": document.querySelector(".pattern-extraction-panel"),
    "pattern-portrait": document.querySelector(".pattern-portrait-panel"),
    "pattern-puzzle": document.querySelector(".pattern-puzzle-panel"),
    "pattern-project": document.querySelector(".pattern-project-panel"),
    "pattern-search": document.querySelector(".pattern-search-panel"),
    "data-modal": document.querySelector(".data-modal-panel"),
    "image-panel": document.querySelector(".image-panel"),
    "image-search-panel": document.querySelector(".image-search-panel"),
    recommendation: document.querySelector(".recommendation-panel"),
  };

  // 存储每个面板的图表实例
  const panelCharts = {
    "pattern-extraction": [],
    "pattern-portrait": [],
    "pattern-puzzle": [],
    "pattern-project": [],
    "pattern-search": [],
    "data-modal": [],
    "image-panel": [],
    "image-search-panel": [],
    recommendation: [],
  };

  // 菜单展开收起
  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("collapsed");
    // 只触发当前显示面板的图表resize
    resizeCurrentPanelCharts();
  });

  // 菜单项点击处理
  document.querySelectorAll(".function-item li a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const panelId = this.getAttribute("href").replace(".html", "");
      switchPanel(panelId);
    });
  });

  // 切换面板
  function switchPanel(panelId) {
    // 隐藏所有面板
    Object.values(panels).forEach((panel) => {
      if (panel) panel.style.display = "none";
    });

    // 显示目标面板
    if (panels[panelId]) {
      panels[panelId].style.display = "flex";
      // 触发当前面板中的图表resize
      resizeCurrentPanelCharts();
    }
  }

  // 注册图表实例到指定面板
  function registerChart(chart, panelId) {
    if (panelCharts[panelId]) {
      panelCharts[panelId].push(chart);
    }
  }

  // resize当前显示面板的图表
  function resizeCurrentPanelCharts() {
    setTimeout(() => {
      // 找到当前显示的面板
      const currentPanel = Object.entries(panels).find(
        ([id, panel]) => panel && panel.style.display !== "none"
      );

      if (currentPanel) {
        const [panelId] = currentPanel;
        // 只resize当前面板的图表
        panelCharts[panelId].forEach((chart) => {
          if (chart && typeof chart.resize === "function") {
            chart.resize();
          }
        });
      }
    }, 300);
  }

  // 暴露注册方法到全局
  window.registerChart = registerChart;
})();

// 添加通用的图表加载效果
export function showChartLoading(chart) {
  chart.showLoading({
    text: "数据加载中...",
    color: "#02a6b5",
    textColor: "#fff",
    maskColor: "rgba(255, 255, 255, 0)",
    zlevel: 0,
    fontSize: 16,
    showSpinner: true,
    spinnerRadius: 10,
    lineWidth: 5,
    fontWeight: "normal",
    fontStyle: "normal",
    fontFamily: "sans-serif",
  });
}

// 注册图表并添加加载效果
export function hideChartLoading(chart) {
  chart.hideLoading();
}

// 更新时间显示
function updateTime() {
  var time = new Date();
  var timeStr =
    time.getFullYear() +
    "年" +
    (time.getMonth() + 1) +
    "月" +
    time.getDate() +
    "日-" +
    time.getHours() +
    "时" +
    time.getMinutes() +
    "分" +
    time.getSeconds() +
    "秒";
  $(".showTime").text("当前时间：" + timeStr);
}
setInterval(updateTime, 1000);
