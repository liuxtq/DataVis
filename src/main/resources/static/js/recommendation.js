import { api } from "./pattern-data.js";

let currentCount = 0;
let isLoading = false;
const BATCH_SIZE = 5;
let hasMoreData = true; // 添加标志位，标记是否还有更多数据

// 偏好选项数据
const preferenceOptions = {
  战斗机: ["F-22猛禽", "苏-35", "歼-20"],
  运输机: ["运-20", "C-17环球霸王", "安-124"],
  轰炸机: ["轰-6K", "B-2幽灵", "图-160"],
};

// 添加mock数据
const mockPreference = {
  preferences: [
    { category: "战斗机", value: "F-22猛禽" },
    { category: "轰炸机", value: "轰-6K" },
  ],
  reportContent: "侦察发现目标",
};

let key;
let owner;

document.addEventListener("DOMContentLoaded", async function () {
  const recommendationList = document.getElementById("recommendation-list");

  // 获取推荐偏好设置
  try {
    const recommendSetting = await api.recommendation.getRecommendSetting();
    console.log(JSON.stringify(recommendSetting));
    key = recommendSetting.key;
    owner = recommendSetting.owner;
    initializePreferenceUI(recommendSetting);
  } catch (error) {
    console.error("获取推荐偏好设置失败，使用mock数据:", error);
    initializePreferenceUI(mockPreference);
  }

  // 初始加载推荐列表
  loadRecommendations();

  // 修改滚动事件监听器
  recommendationList.addEventListener("scroll", function () {
    // 添加调试日志
    console.log("Scroll event triggered");
    console.log("isLoading:", isLoading);
    console.log("hasMoreData:", hasMoreData);

    if (isLoading || !hasMoreData) return;

    const scrollTop = recommendationList.scrollTop;
    const clientHeight = recommendationList.clientHeight;
    const scrollHeight = recommendationList.scrollHeight;

    // 添加调试日志
    console.log("scrollTop:", scrollTop);
    console.log("clientHeight:", clientHeight);
    console.log("scrollHeight:", scrollHeight);

    // 当滚动到距离底部20px时触发加载
    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 20) {
      console.log("Triggering load more...");
      loadRecommendations();
    }
  });

  // 添加一个初始检查，如果内容不足以滚动，就自动加载更多
  function checkInitialContent() {
    const clientHeight = recommendationList.clientHeight;
    const scrollHeight = recommendationList.scrollHeight;

    if (scrollHeight <= clientHeight && hasMoreData && !isLoading) {
      loadRecommendations();
    }
  }

  // 在初始加载完成后检查内容
  setTimeout(checkInitialContent, 500);
});

function initializePreferenceUI(initialData = null) {
  const container = document.querySelector(".recommendation-panel");
  const preferenceContainer = document.createElement("div");
  preferenceContainer.className = "preference-container";

  preferenceContainer.innerHTML = `
    <div class="preference-header">
      <i class="fas fa-cog"></i>
      推荐偏好设置
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="preference-content">
      <div class="input-row">
        <div class="input-label">识别目标</div>
        <div class="dropdown-container">
          <div class="dropdown-trigger">
            <div class="selected-items">
              <span>选择偏好类型</span>
            </div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="dropdown-menu">
            ${Object.entries(preferenceOptions)
              .map(
                ([category, items]) => `
              <div class="dropdown-category">
                <div class="category-header">
                  <input type="checkbox" class="checkbox category-checkbox" data-category="${category}">
                  <span class="category-name">${category}</span>
                </div>
                <div class="category-items">
                  ${items
                    .map(
                      (item) => `
                    <div class="category-item">
                      <input type="checkbox" class="checkbox item-checkbox" data-category="${category}" data-value="${item}">
                      <span class="item-name">${item}</span>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="input-row">
        <div class="input-label">快报关键字</div>
        <div class="input-field">
          <input type="text" id="report-content" placeholder="请输入快报内容关键词">
        </div>
      </div>
      <div class="button-row">
        <button class="save-btn">设置</button>
      </div>
    </div>
  `;

  // 插入到recommendation-container之前
  container.insertBefore(preferenceContainer, container.firstChild);

  // 绑定事件
  const preferenceHeader =
    preferenceContainer.querySelector(".preference-header");
  const preferenceContent = preferenceContainer.querySelector(
    ".preference-content"
  );
  const dropdownTrigger =
    preferenceContainer.querySelector(".dropdown-trigger");
  const dropdownMenu = preferenceContainer.querySelector(".dropdown-menu");
  const saveBtn = preferenceContainer.querySelector(".save-btn");
  const reportContent = preferenceContainer.querySelector("#report-content");

  let selectedItems = new Set(); // 存储选中的项目

  // 如果有初始数据，预先设置选中项
  if (initialData) {
    // 设置快报内容
    if (initialData.reportContent) {
      setTimeout(() => {
        const reportInput = document.querySelector("#report-content");
        if (reportInput) {
          reportInput.value = initialData.reportContent;
        }
      }, 0);
    }

    // 设置目标选中状态
    if (initialData.preferences && Array.isArray(initialData.preferences)) {
      initialData.preferences.forEach((pref) => {
        const { category, value } = pref;
        if (preferenceOptions[category]?.includes(value)) {
          selectedItems.add({ category, value });

          // 延迟设置复选框状态，确保DOM已经渲染
          setTimeout(() => {
            const itemCheckbox = document.querySelector(
              `.item-checkbox[data-category="${category}"][data-value="${value}"]`
            );
            if (itemCheckbox) {
              itemCheckbox.checked = true;

              // 更新类别复选框状态
              const categoryCheckbox = document.querySelector(
                `.category-checkbox[data-category="${category}"]`
              );
              const subItems = document.querySelectorAll(
                `.item-checkbox[data-category="${category}"]`
              );
              const allChecked = Array.from(subItems).every(
                (item) => item.checked
              );
              const someChecked = Array.from(subItems).some(
                (item) => item.checked
              );

              if (categoryCheckbox) {
                categoryCheckbox.checked = allChecked;
                categoryCheckbox.indeterminate = someChecked && !allChecked;
              }
            }
          }, 0);
        }
      });

      // 更新选中项显示
      setTimeout(() => {
        updateSelectedDisplay();
      }, 0);
    }
  }

  // 折叠/展开事件
  preferenceHeader.addEventListener("click", () => {
    preferenceHeader.classList.toggle("collapsed");
    preferenceContent.classList.toggle("collapsed");
  });

  // 下拉菜单点击事件
  dropdownTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
  });

  // 处理类别复选框点击
  dropdownMenu.querySelectorAll(".category-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("click", (e) => {
      e.stopPropagation();
      const category = checkbox.dataset.category;
      const subItems = dropdownMenu.querySelectorAll(
        `.item-checkbox[data-category="${category}"]`
      );

      subItems.forEach((item) => {
        item.checked = checkbox.checked;
        const value = item.dataset.value;
        if (checkbox.checked) {
          selectedItems.add({ category, value });
        } else {
          for (let selected of selectedItems) {
            if (selected.category === category) {
              selectedItems.delete(selected);
            }
          }
        }
      });

      updateSelectedDisplay();
    });
  });

  // 处理子项复选框点击
  dropdownMenu.querySelectorAll(".item-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("click", (e) => {
      e.stopPropagation();
      const { category, value } = checkbox.dataset;

      if (checkbox.checked) {
        selectedItems.add({ category, value });
      } else {
        for (let selected of selectedItems) {
          if (selected.category === category && selected.value === value) {
            selectedItems.delete(selected);
            break;
          }
        }
      }

      // 更新父类别复选框状态
      const categoryCheckbox = dropdownMenu.querySelector(
        `.category-checkbox[data-category="${category}"]`
      );
      const subItems = dropdownMenu.querySelectorAll(
        `.item-checkbox[data-category="${category}"]`
      );
      const allChecked = Array.from(subItems).every((item) => item.checked);
      const someChecked = Array.from(subItems).some((item) => item.checked);

      categoryCheckbox.checked = allChecked;
      categoryCheckbox.indeterminate = someChecked && !allChecked;

      updateSelectedDisplay();
    });
  });

  // 更新选中项显示
  function updateSelectedDisplay() {
    const selectedItemsContainer =
      dropdownTrigger.querySelector(".selected-items");
    if (selectedItems.size === 0) {
      selectedItemsContainer.innerHTML = "<span>选择偏好类型</span>";
      return;
    }

    selectedItemsContainer.innerHTML = Array.from(selectedItems)
      .map(
        (item) => `
        <span class="selected-item">
          ${item.category} - ${item.value}
          <span class="remove-item" data-category="${item.category}" data-value="${item.value}">×</span>
        </span>
      `
      )
      .join("");
  }

  // 处理删除选中项
  dropdownTrigger
    .querySelector(".selected-items")
    .addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-item")) {
        e.stopPropagation();
        const { category, value } = e.target.dataset;

        for (let selected of selectedItems) {
          if (selected.category === category && selected.value === value) {
            selectedItems.delete(selected);
            break;
          }
        }

        // 更新复选框状态
        const checkbox = dropdownMenu.querySelector(
          `.item-checkbox[data-category="${category}"][data-value="${value}"]`
        );
        if (checkbox) checkbox.checked = false;

        updateSelectedDisplay();
      }
    });

  // 点击外部关闭下拉菜单
  document.addEventListener("click", (e) => {
    if (
      !dropdownTrigger.contains(e.target) &&
      !dropdownMenu.contains(e.target)
    ) {
      dropdownMenu.classList.remove("show");
    }
  });

  // 修改保存按钮点击事件
  saveBtn.addEventListener("click", async () => {
    if (selectedItems.size === 0) return;

    showLoading();
    try {
      const preferences = Array.from(selectedItems).map((item) => ({
        category: item.category,
        value: item.value,
      }));

      await api.recommendation.recommendSetting({
        key: key,
        owner: owner,
        preferences,
        reportContent: reportContent.value.trim(),
      });

      // 重置所有状态
      currentCount = 0;
      hasMoreData = true; // 重置hasMoreData标志
      const recommendationList = document.getElementById("recommendation-list");
      recommendationList.innerHTML = "";
      await loadRecommendations();

      // 设置成功后折叠面板
      preferenceHeader.classList.add("collapsed");
      preferenceContent.classList.add("collapsed");
    } catch (error) {
      console.error("设置偏好失败:", error);
    } finally {
      hideLoading();
    }
  });

  // 默认折叠
  preferenceHeader.classList.add("collapsed");
  preferenceContent.classList.add("collapsed");
}

function showLoading() {
  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
  document.body.appendChild(loadingOverlay);
}

function hideLoading() {
  const loadingOverlay = document.querySelector(".loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.remove();
  }
}

async function setPreference(preference) {
  try {
    const response = await fetch(`${API_BASE_URL}/setPreference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      throw new Error("设置偏好失败");
    }

    return await response.json();
  } catch (error) {
    console.error("设置偏好失败:", error);
    throw error;
  }
}

function getTypeClass(mtype) {
  switch (mtype) {
    case "航天侦察快报":
      return "type-report";
    case "识别目标":
      return "type-target";
    default:
      return "type-alert";
  }
}

function appendRecommendations(recommendations) {
  const recommendationList = document.getElementById("recommendation-list");

  recommendations.forEach((recommendation) => {
    const typeClass = getTypeClass(recommendation.mtype);
    const card = document.createElement("div");
    card.className = `recommendation-card ${typeClass}`;

    let contentHtml = "";

    // 添加消息内容
    if (recommendation.msg) {
      contentHtml += `<div class="card-content">${recommendation.msg}</div>`;
    }

    // 添加目标信息
    if (recommendation.targetName) {
      contentHtml += `
        <div class="card-target">
          <i class="fas fa-crosshairs"></i>
          <span>目标: ${recommendation.targetName}</span>
        </div>
      `;
    }

    // 添加图片
    if (recommendation.pngUrl) {
      contentHtml += `
        <img src="${recommendation.pngUrl}" alt="目标图片" class="card-image">
      `;
    }

    card.innerHTML = `
      <div class="card-header">
        <span class="mtype ${typeClass}">${recommendation.mtype}</span>
        <span class="time">${recommendation.time || "时间未知"}</span>
      </div>
      ${contentHtml}
    `;

    recommendationList.appendChild(card);
  });
}

// 添加底部加载状态和提示
function appendLoadingState() {
  const loadingState = document.createElement("div");
  loadingState.className = "loading-state";
  loadingState.innerHTML =
    '<div class="loading-spinner-small"></div><span>加载中...</span>';
  return loadingState;
}

function appendEndMessage() {
  // Remove any existing end messages first
  const existingEndMessages = document.querySelectorAll(".end-message");
  existingEndMessages.forEach((msg) => msg.remove());

  // Add new end message
  const endMessage = document.createElement("div");
  endMessage.className = "end-message";
  endMessage.textContent = "已经到底了";
  recommendationList.appendChild(endMessage);
}

async function loadRecommendations() {
  if (isLoading || !hasMoreData) return;

  isLoading = true;
  const recommendationList = document.getElementById("recommendation-list");

  // 移除之前的加载状态和结束消息
  const existingLoadingStates = document.querySelectorAll(".loading-state");
  existingLoadingStates.forEach((state) => state.remove());

  const existingEndMessages = document.querySelectorAll(".end-message");
  existingEndMessages.forEach((msg) => msg.remove());

  const loadingState = appendLoadingState();
  recommendationList.appendChild(loadingState);

  try {
    const recommendations = await api.recommendation.getRecommendations(
      currentCount,
      BATCH_SIZE
    );
    loadingState.remove();

    if (recommendations && recommendations.length > 0) {
      appendRecommendations(recommendations);
      currentCount += recommendations.length;

      // 只有当返回的数据数量小于请求的数量时，才标记没有更多数据
      if (recommendations.length < BATCH_SIZE) {
        hasMoreData = false;
        appendEndMessage();
      }
    } else {
      hasMoreData = false;
      appendEndMessage();
    }
  } catch (error) {
    console.error("加载推荐信息失败:", error);
    loadingState.remove();
  } finally {
    isLoading = false;
  }
}

// 修改推荐容器的HTML结构
const recommendationContainer = document.querySelector(
  ".recommendation-container"
);
if (recommendationContainer) {
  recommendationContainer.innerHTML = `
    <div class="recommendation-header">
      <h2>
        <i class="fas fa-lightbulb"></i>
        推荐信息
      </h2>
    </div>
    <div class="recommendation-list" id="recommendation-list">
      <!-- 推荐卡片将动态插入这里 -->
    </div>
  `;
}
