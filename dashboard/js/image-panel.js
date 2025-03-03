document.addEventListener("DOMContentLoaded", function () {
  // 获取所有图像类型菜单项
  const imageTypeItems = document.querySelectorAll(
    ".function-item:nth-child(3) li"
  );
  const imagePanel = document.querySelector(".image-panel");

  // 图像类型与ID的映射
  const typeToId = {
    立体投影图像: "stereo-projection",
    扫描投影图像: "scan-projection",
    "合成孔径雷达(SAR)投影图像": "sar-projection",
    多光谱和高光谱成像图像: "multispectral",
    热红外成像图像: "thermal",
    "激光雷达(LiDAR)图像": "lidar",
  };

  // Mock 数据
  const mockImageData = {
    // 立体投影图像
    "stereo-projection": {
      total: 156,
      images: Array(5)
        .fill(null)
        .map((_, i) => ({
          url: `/images/stereo/image${i + 1}.jpg`,
          name: `Stereo_${String(i + 1).padStart(3, "0")}`,
          size: "2.3MB",
        })),
    },
    // 扫描投影图像
    "scan-projection": {
      total: 234,
      images: Array(5)
        .fill(null)
        .map((_, i) => ({
          url: `/images/scan/image${i + 1}.jpg`,
          name: `Scan_${String(i + 1).padStart(3, "0")}`,
          size: "1.8MB",
        })),
    },
    // 合成孔径雷达(SAR)投影图像
    "sar-projection": {
      total: 100,
      images: Array(5)
        .fill(null)
        .map((_, i) => ({
          url: `/images/sar/image${i + 1}.jpg`,
          name: `SAR_${String(i + 1).padStart(3, "0")}`,
          size: "2.5MB",
        })),
    },
    // 多光谱和高光谱成像图像
    multispectral: {
      total: 150,
      images: Array(5)
        .fill(null)
        .map((_, i) => ({
          url: `/images/multispectral/image${i + 1}.jpg`,
          name: `Multispectral_${String(i + 1).padStart(3, "0")}`,
          size: "3.2MB",
        })),
    },
    // 热红外成像图像
    thermal: {
      total: 120,
      images: Array(5)
        .fill(null)
        .map((_, i) => ({
          url: `/images/thermal/image${i + 1}.jpg`,
          name: `Thermal_${String(i + 1).padStart(3, "0")}`,
          size: "2.8MB",
        })),
    },
    // 激光雷达(LiDAR)图像
    lidar: {
      total: 130,
      images: Array(5)
        .fill(null)
        .map((_, i) => ({
          url: `/images/lidar/image${i + 1}.jpg`,
          name: `Lidar_${String(i + 1).padStart(3, "0")}`,
          size: "3.5MB",
        })),
    },
  };

  // 初始化所有图像网格
  Object.keys(mockImageData).forEach((typeId) => {
    const grid = document.getElementById(`${typeId}-images`);
    if (grid) {
      mockImageData[typeId].images.forEach((image) => {
        const card = createImageCard(image);
        grid.appendChild(card);
      });
    }
  });

  // 为菜单项添加点击事件
  imageTypeItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const imageType = this.textContent.trim();
      const targetId = typeToId[imageType];

      // 显示图像面板
      document.querySelectorAll(".mainbox > div").forEach((panel) => {
        panel.style.display = "none";
      });
      imagePanel.style.display = "block";

      // 滚动到对应部分
      if (targetId) {
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  function createImageCard(image) {
    const card = document.createElement("div");
    card.className = "image-card";
    card.innerHTML = `
      <img src="${image.url}" alt="${image.name}">
      <div class="image-info">
        <p class="image-name">${image.name}</p>
        <span class="image-size">${image.size}</span>
      </div>
    `;
    return card;
  }
});
