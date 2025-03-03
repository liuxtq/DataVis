// 共享的模式数据
const PatternData = {
  // MySQL数据模式
  patterns: {
    mysqlPatterns: [
      {
        name: "机场信息模式",
        value: 150,
        fields: [
          "机场名称",
          "三字码",
          "四字码",
          "国家/地区",
          "航站楼数量",
          "停机位数量",
          "跑道数量",
          "货运设施面积",
          "旅客吞吐量",
          "货物吞吐量",
          "飞机起降次数",
        ],
        example: {
          机场名称: "首都国际机场",
          三字码: "PEK",
          四字码: "ZBAA",
          "国家/地区": "中国",
          航站楼数量: 3,
          停机位数量: 314,
          跑道数量: 3,
          货运设施面积: "200000㎡",
          旅客吞吐量: "100000000人次/年",
          货物吞吐量: "200万吨/年",
          飞机起降次数: "600000次/年",
        },
      },
      {
        name: "港口信息模式",
        value: 120,
        fields: [
          "港口名称",
          "港口代码",
          "国家",
          "港口类型",
          "码头数量",
          "泊位数量",
          "岸线长度",
          "起重设备数量",
          "货物吞吐量",
          "船舶停靠次数",
          "最大可停靠船舶吨位",
        ],
        example: {
          港口名称: "上海港",
          港口代码: "CNSHA",
          国家: "中国",
          港口类型: "综合性港口",
          码头数量: 50,
          泊位数量: 200,
          岸线长度: "20000米",
          起重设备数量: 500,
          货物吞吐量: "4300万标准箱/年",
          船舶停靠次数: "50000次/年",
          最大可停靠船舶吨位: "200000吨",
        },
      },
      {
        name: "飞机信息模式",
        value: 200,
        fields: [
          "型号",
          "制造商",
          "最大起飞重量",
          "航程",
          "巡航速度",
          "座位数",
          "发动机类型",
          "翼展",
          "首飞时间",
          "所属航空公司",
        ],
        example: {
          型号: "B787-9",
          制造商: "波音",
          最大起飞重量: "254000kg",
          航程: "14140km",
          巡航速度: "903km/h",
          座位数: "290",
          发动机类型: "GEnx-1B",
          翼展: "60.17m",
          首飞时间: "2009-12-15",
          所属航空公司: "中国国际航空",
        },
      },
      {
        name: "船只信息模式",
        value: 180,
        fields: [
          "船名",
          "船型",
          "制造商",
          "总吨位",
          "长度",
          "宽度",
          "吃水深度",
          "航速",
          "建造年份",
          "所属公司或国家",
        ],
        example: {
          船名: "COSCO SHIPPING VIRGO",
          船型: "集装箱船",
          制造商: "江南造船厂",
          总吨位: "198000吨",
          长度: "400米",
          宽度: "58.6米",
          吃水深度: "16米",
          航速: "22节",
          建造年份: "2020",
          所属公司或国家: "中远海运",
        },
      },
      {
        name: "传感器信息模式",
        value: 160,
        fields: [
          "型号",
          "类型",
          "制造商",
          "测量范围",
          "精度",
          "分辨率",
          "通信接口",
          "供电电压",
        ],
        example: {
          型号: "DHT22",
          类型: "温湿度传感器",
          制造商: "Aosong",
          测量范围: "-40~80℃, 0-100%RH",
          精度: "±0.5℃, ±2%RH",
          分辨率: "0.1℃, 0.1%RH",
          通信接口: "数字单总线",
          供电电压: "3.3-5.5V DC",
        },
      },
    ],

    // IoTDB时序数据模式
    iotdbPatterns: [
      {
        name: "飞行实时数据模式",
        value: 250,
        metrics: ["经纬度", "海拔", "速度", "航向", "垂直速度", "飞行状态"],
        example: {
          经纬度: "39.9042° N, 116.4074° E",
          海拔: "10000米",
          速度: "800km/h",
          航向: "45°",
          垂直速度: "+300米/分",
          飞行状态: "巡航",
        },
      },
      {
        name: "航行实时数据模式",
        value: 220,
        metrics: ["经纬度", "航速", "航向", "吃水深度", "风速", "海况"],
        example: {
          经纬度: "31.2304° N, 121.4737° E",
          航速: "20节",
          航向: "90°",
          吃水深度: "15米",
          风速: "15节",
          海况: "3级浪",
        },
      },
      {
        name: "环境传感器数据模式",
        value: 280,
        metrics: [
          "温度",
          "湿度",
          "气压",
          "风速",
          "风向",
          "PM2.5",
          "PM10",
          "CO2浓度",
        ],
        example: {
          温度: "25℃",
          湿度: "65%",
          气压: "1013.25hPa",
          风速: "3m/s",
          风向: "东北",
          "PM2.5": "35μg/m³",
          PM10: "70μg/m³",
          CO2浓度: "400ppm",
        },
      },
    ],

    // MongoDB文档模式
    mongoPatterns: [
      {
        name: "目标识别结果模式",
        value: 180,
        fields: [
          "目标ID",
          "目标类别",
          "置信度",
          "位置信息",
          "识别图像",
          "时间戳",
          "目标尺寸",
          "运动状态",
          "识别来源",
        ],
        example: {
          目标ID: "TGT20230001",
          目标类别: "民用客机",
          置信度: 0.95,
          位置信息: {
            经度: 116.4074,
            纬度: 39.9042,
            高度: 10000,
          },
          识别图像: "base64://...",
          时间戳: "2023-05-20T10:30:00Z",
          目标尺寸: {
            长: "73.9米",
            宽: "64.8米",
            高: "19.4米",
          },
          运动状态: "巡航",
          识别来源: "雷达站A",
        },
      },
      {
        name: "目标检测结果模式",
        value: 220,
        fields: [
          "目标ID",
          "目标类别",
          "置信度",
          "位置信息",
          "检测图像",
          "时间戳",
          "目标尺寸",
          "运动状态",
          "检测来源",
        ],
        example: {
          目标ID: "TGT20230002",
          目标类别: "货轮",
          置信度: 0.92,
          位置信息: {
            经度: 121.4737,
            纬度: 31.2304,
          },
          检测图像: "base64://...",
          时间戳: "2023-05-20T10:30:00Z",
          目标尺寸: {
            长: "400米",
            宽: "58.6米",
          },
          运动状态: "航行中",
          检测来源: "岸基雷达",
        },
      },
      {
        name: "目标分析结果模式",
        value: 160,
        fields: [
          "目标ID",
          "目标类别",
          "置信度",
          "位置信息",
          "行为分析",
          "时间戳",
          "目标尺寸",
          "运动轨迹",
          "分析来源",
        ],
        example: {
          目标ID: "TGT20230003",
          目标类别: "民用客机",
          置信度: 0.88,
          位置信息: {
            起点: { 经度: 116.4074, 纬度: 39.9042 },
            终点: { 经度: 121.4737, 纬度: 31.2304 },
          },
          行为分析: "正常航线飞行",
          时间戳: "2023-05-20T10:30:00Z",
          目标尺寸: {
            长: "73.9米",
            宽: "64.8米",
            高: "19.4米",
          },
          运动轨迹: [
            { 时间: "T1", 位置: "P1" },
            { 时间: "T2", 位置: "P2" },
          ],
          分析来源: "综合分析系统A",
        },
      },
    ],

    // 添加文件系统模式
    fileSystemPatterns: {
      imageTypes: [
        {
          name: "立体投影图像",
          count: 2800,
          size: "1.2TB",
          format: [".tif", ".raw"],
          relations: ["目标识别结果", "目标检测结果"],
        },
        {
          name: "扫描投影图像",
          count: 3200,
          size: "1.5TB",
          format: [".tif", ".img"],
          relations: ["目标识别结果", "目标分析结果"],
        },
        {
          name: "SAR投影图像",
          count: 2100,
          size: "980GB",
          format: [".dat", ".img"],
          relations: ["目标检测结果"],
        },
        {
          name: "多光谱高光谱图像",
          count: 1800,
          size: "2.1TB",
          format: [".raw", ".dat"],
          relations: ["目标分析结果"],
        },
        {
          name: "热红外成像图像",
          count: 2500,
          size: "750GB",
          format: [".ir", ".img"],
          relations: ["目标识别结果"],
        },
        {
          name: "激光雷达图像",
          count: 1500,
          size: "1.8TB",
          format: [".las", ".laz"],
          relations: ["目标检测结果"],
        },
        {
          name: "一般图像",
          count: 5600,
          size: "450GB",
          format: [".jpg", ".png"],
          relations: ["目标识别结果"],
        },
        {
          name: "一般文档",
          count: 4200,
          size: "120GB",
          format: [".doc", ".pdf", ".txt"],
          relations: ["机场信息", "港口信息"],
        },
      ],
    },
  },

  // 模式特征数据
  patternFeatures: {
    indicators: [
      { name: "数据完整性", max: 100 },
      { name: "更新频率", max: 100 },
      { name: "关联度", max: 100 },
      { name: "时效性", max: 100 },
      { name: "可用性", max: 100 },
    ],
    values: {
      MySQL基础数据: [95, 70, 85, 75, 90],
      IoTDB时序数据: [85, 95, 80, 95, 85],
      MongoDB分析结果: [80, 75, 90, 85, 95],
    },
  },

  // 模式关系网络
  networkData: {
    nodes: [
      { name: "机场信息", category: 0, value: 20 },
      { name: "港口信息", category: 0, value: 20 },
      { name: "飞机基础信息", category: 0, value: 25 },
      { name: "船只基础信息", category: 0, value: 25 },
      { name: "传感器信息", category: 0, value: 15 },
      { name: "飞行数据", category: 1, value: 30 },
      { name: "航行数据", category: 1, value: 30 },
      { name: "环境数据", category: 1, value: 25 },
      { name: "目标识别", category: 2, value: 20 },
      { name: "目标检测", category: 2, value: 25 },
      { name: "目标分析", category: 2, value: 30 },
    ],
    links: [
      { source: "飞机基础信息", target: "飞行数据", value: 0.8 },
      { source: "船只基础信息", target: "航行数据", value: 0.8 },
      { source: "传感器信息", target: "环境数据", value: 0.9 },
      { source: "飞行数据", target: "目标识别", value: 0.7 },
      { source: "航行数据", target: "目标识别", value: 0.7 },
      { source: "目标识别", target: "目标检测", value: 0.9 },
      { source: "目标检测", target: "目标分析", value: 0.9 },
      { source: "机场信息", target: "飞机基础信息", value: 0.6 },
      { source: "港口信息", target: "船只基础信息", value: 0.6 },
    ],
  },

  // 时序数据生成器
  generateTimeSeriesData: function (patternName, days = 30) {
    const data = [];
    let now = new Date();
    let baseValue = 0;

    // 根据不同模式设置基准值和波动范围
    switch (patternName) {
      case "飞行数据":
        baseValue = 800; // 飞行速度基准值
        break;
      case "航行数据":
        baseValue = 30; // 航行速度基准值
        break;
      case "环境数据":
        baseValue = 25; // 温度基准值
        break;
      default:
        baseValue = 50;
    }

    for (let i = 0; i < days; i++) {
      let value =
        baseValue +
        Math.sin(i / 5) * (baseValue * 0.2) + // 周期波动
        Math.random() * (baseValue * 0.1); // 随机波动

      data.push([
        new Date(now - 1000 * 60 * 60 * 24 * i),
        Math.round(value * 100) / 100,
      ]);
    }
    return data.reverse();
  },

  // 聚类数据生成器
  generateClusterData: function () {
    const clusters = [
      { name: "MySQL数据模式", center: [25, 25] },
      { name: "IoTDB数据模式", center: [75, 25] },
      { name: "MongoDB数据模式", center: [50, 75] },
    ];

    const data = [];
    clusters.forEach((cluster, idx) => {
      for (let i = 0; i < 20; i++) {
        data.push([
          cluster.center[0] + Math.random() * 20 - 10,
          cluster.center[1] + Math.random() * 20 - 10,
          Math.random() * 20 + 10,
          cluster.name,
        ]);
      }
    });
    return data;
  },
};

// #################
// 定义全局map,指定columns前缀对应的数据库类型
// 此处根据实际数据库类型进行修改
const dbTypeMap = {
  relational: ["relational", "kt2"],
  iotdb: ["iotdb"],
  mongodb: ["mongodb"],
  filesystem: ["filesystem"],
};

// API 基础路径
//const API_BASE_URL = "http://localhost:18080/api";
const API_BASE_URL = "http://192.168.56.101:8080";
// Mock 数据
const mockData = {
  // 集群信息数据
  clusterData: {
    iginxInfos: [
      { id: 1, ip: "192.168.1.100", port: 8080 },
      { id: 2, ip: "192.168.1.101", port: 8080 },
    ],
    storageEngineInfos: [
      { id: 1, ip: "192.168.1.100", port: 3306, type: "relational" },
      { id: 2, ip: "192.168.1.101", port: 6667, type: "iotdb12" },
      { id: 3, ip: "192.168.1.102", port: 27017, type: "mongodb" },
      { id: 4, ip: "192.168.1.103", port: 8881, type: "filesystem" },
      { id: 5, ip: "192.168.1.104", port: 8882, type: "filesystem" },
      { id: 6, ip: "192.168.1.105", port: 8883, type: "filesystem" },
      { id: 7, ip: "192.168.1.106", port: 8884, type: "filesystem" },
      { id: 8, ip: "192.168.1.107", port: 8885, type: "filesystem" },
    ],
  },

  // 模式提取数据
  columns: [
    { path: "relational.机场信息.机场名称", type: "VARCHAR" },
    { path: "relational.机场信息.三字码", type: "VARCHAR" },
    { path: "relational.机场信息.四字码", type: "VARCHAR" },
    { path: "relational.机场信息.国家", type: "VARCHAR" },
    { path: "relational.机场信息.航站楼数量", type: "VARCHAR" },
    { path: "relational.机场信息.停机位数量", type: "VARCHAR" },
    { path: "relational.机场信息.跑道数量", type: "VARCHAR" },
    { path: "relational.机场信息.货运设施面积", type: "VARCHAR" },
    { path: "relational.机场信息.旅客吞吐量", type: "VARCHAR" },
    { path: "relational.机场信息.货物吞吐量", type: "VARCHAR" },
    { path: "relational.机场信息.飞机起降次数", type: "VARCHAR" },
    { path: "relational.港口信息.港口名称", type: "VARCHAR" },
    { path: "relational.港口信息.港口代码", type: "VARCHAR" },
    { path: "relational.港口信息.国家", type: "VARCHAR" },
    { path: "relational.港口信息.港口类型", type: "VARCHAR" },
    { path: "relational.港口信息.码头数量", type: "VARCHAR" },
    { path: "relational.港口信息.泊位数量", type: "VARCHAR" },
    { path: "relational.港口信息.岸线长度", type: "VARCHAR" },
    { path: "relational.港口信息.起重设备数量", type: "VARCHAR" },
    { path: "relational.港口信息.货物吞吐量", type: "VARCHAR" },
    { path: "relational.港口信息.船舶停靠次数", type: "VARCHAR" },
    { path: "relational.港口信息.最大可停靠船舶吨位", type: "VARCHAR" },
    { path: "relational.飞机信息.型号", type: "VARCHAR" },
    { path: "relational.飞机信息.制造商", type: "VARCHAR" },
    { path: "relational.飞机信息.最大起飞重量", type: "VARCHAR" },
    { path: "relational.飞机信息.航程", type: "VARCHAR" },
    { path: "relational.飞机信息.巡航速度", type: "VARCHAR" },
    { path: "relational.飞机信息.座位数", type: "VARCHAR" },
    { path: "relational.飞机信息.发动机类型", type: "VARCHAR" },
    { path: "relational.飞机信息.翼展", type: "VARCHAR" },
    { path: "relational.飞机信息.首飞时间", type: "VARCHAR" },
    { path: "relational.飞机信息.所属航空公司", type: "VARCHAR" },
    { path: "relational.船只信息.船名", type: "VARCHAR" },
    { path: "relational.船只信息.船型", type: "VARCHAR" },
    { path: "relational.船只信息.制造商", type: "VARCHAR" },
    { path: "relational.船只信息.总吨位", type: "VARCHAR" },
    { path: "relational.船只信息.长度", type: "VARCHAR" },
    { path: "relational.船只信息.宽度", type: "VARCHAR" },
    { path: "relational.船只信息.吃水深度", type: "VARCHAR" },
    { path: "relational.船只信息.航速", type: "VARCHAR" },
    { path: "relational.船只信息.建造年份", type: "VARCHAR" },
    { path: "relational.船只信息.所属公司或国家", type: "VARCHAR" },
    { path: "relational.传感器信息.型号", type: "VARCHAR" },
    { path: "relational.传感器信息.类型", type: "VARCHAR" },
    { path: "relational.传感器信息.制造商", type: "VARCHAR" },
    { path: "relational.传感器信息.测量范围", type: "VARCHAR" },
    { path: "relational.传感器信息.精度", type: "VARCHAR" },
    { path: "relational.传感器信息.分辨率", type: "VARCHAR" },
    { path: "relational.传感器信息.通信接口", type: "VARCHAR" },
    { path: "relational.传感器信息.供电电压", type: "VARCHAR" },
    { path: "relational.传感器信息.供电电流", type: "VARCHAR" },
    { path: "relational.传感器信息.工作温度", type: "VARCHAR" },
    { path: "relational.传感器信息.工作湿度", type: "VARCHAR" },
    { path: "relational.传感器信息.工作压力", type: "VARCHAR" },
    { path: "relational.传感器信息.工作电压", type: "VARCHAR" },
    { path: "relational.传感器信息.工作电流", type: "VARCHAR" },
    { path: "relational.传感器信息.工作频率", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.目标ID", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.目标类别", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.置信度", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.位置信息", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.检测图像", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.时间戳", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.目标尺寸", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.运动状态", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.检测来源", type: "VARCHAR" },
    { path: "mongodb.目标识别结果模式.港口信息.港口名称", type: "VARCHAR" }, // 网状图，关联展示使用

    { path: "mongodb.目标检测结果模式.目标ID", type: "VARCHAR" },
    { path: "mongodb.目标检测结果模式.目标类别", type: "VARCHAR" },
    { path: "mongodb.目标检测结果模式.置信度", type: "VARCHAR" },
    { path: "mongodb.目标检测结果模式.位置信息", type: "VARCHAR" },
    { path: "mongodb.目标检测结果模式.检测图像", type: "VARCHAR" },
    { path: "mongodb.目标检测结果模式.时间戳", type: "VARCHAR" },
    { path: "mongodb.目标检测结果模式.目标尺寸", type: "VARCHAR" },
    { path: "mongodb.目标检测结果模式.运动状态", type: "VARCHAR" },
    { path: "mongodb.目标检测结果模式.检测来源", type: "VARCHAR" },
    //{ path: "mongodb.目标识别结果模式.机场信息.机场名称", type: "VARCHAR" }, // 网状图，关联展示使用

    { path: "mongodb.目标分析结果模式.目标ID", type: "VARCHAR" },
    { path: "mongodb.目标分析结果模式.目标类别", type: "VARCHAR" },
    { path: "mongodb.目标分析结果模式.置信度", type: "VARCHAR" },
    { path: "mongodb.目标分析结果模式.位置信息", type: "VARCHAR" },
    { path: "mongodb.目标分析结果模式.检测图像", type: "VARCHAR" },
    { path: "mongodb.目标分析结果模式.时间戳", type: "VARCHAR" },
    { path: "mongodb.目标分析结果模式.目标尺寸", type: "VARCHAR" },
    { path: "mongodb.目标分析结果模式.运动状态", type: "VARCHAR" },
    { path: "mongodb.目标分析结果模式.检测来源", type: "VARCHAR" },
    //{ path: "mongodb.目标分析结果模式.船只信息.船名", type: "VARCHAR" }, // 网状图，关联展示使用

    { path: "iotdb.飞行实时数据模式.飞行ID", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行状态", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行类型", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行时间", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行位置", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行高度", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行速度", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行方向", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行距离", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行时间", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行速度", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行方向", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞行距离", type: "VARCHAR" },
    { path: "iotdb.飞行实时数据模式.飞机信息.型号", type: "VARCHAR" }, // 网状图，关联展示使用

    { path: "iotdb.航行实时数据模式.航行ID", type: "VARCHAR" },
    { path: "iotdb.航行实时数据模式.航行状态", type: "VARCHAR" },
    { path: "iotdb.航行实时数据模式.航行类型", type: "VARCHAR" },
    { path: "iotdb.航行实时数据模式.航行时间", type: "VARCHAR" },
    { path: "iotdb.航行实时数据模式.航行位置", type: "VARCHAR" },
    { path: "iotdb.航行实时数据模式.航行高度", type: "VARCHAR" },
    { path: "iotdb.航行实时数据模式.航行速度", type: "VARCHAR" },
    { path: "iotdb.航行实时数据模式.航行方向", type: "VARCHAR" },
    { path: "iotdb.航行实时数据模式.航行距离", type: "VARCHAR" },
    { path: "iotdb.航行实时数据模式.航行时间", type: "VARCHAR" },

    { path: "iotdb.环境实时数据模式.环境ID", type: "VARCHAR" },
    { path: "iotdb.环境实时数据模式.环境状态", type: "VARCHAR" },
    { path: "iotdb.环境实时数据模式.环境类型", type: "VARCHAR" },
    { path: "iotdb.环境实时数据模式.环境时间", type: "VARCHAR" },
    { path: "iotdb.环境实时数据模式.环境位置", type: "VARCHAR" },
    { path: "iotdb.环境实时数据模式.环境温度", type: "VARCHAR" },
    { path: "iotdb.环境实时数据模式.环境湿度", type: "VARCHAR" },
    { path: "iotdb.环境实时数据模式.环境压力", type: "VARCHAR" },
    { path: "iotdb.环境实时数据模式.环境风速", type: "VARCHAR" },
    { path: "iotdb.环境实时数据模式.环境风向", type: "VARCHAR" },

    { path: "filesystem.立体投影图像.立体投影图像ID", type: "VARCHAR" },
    { path: "filesystem.立体投影图像.立体投影图像名称", type: "VARCHAR" },
    { path: "filesystem.立体投影图像.立体投影图像路径", type: "VARCHAR" },

    { path: "filesystem.扫描投影图像.扫描投影图像ID", type: "VARCHAR" },
    { path: "filesystem.扫描投影图像.扫描投影图像名称", type: "VARCHAR" },
    { path: "filesystem.扫描投影图像.扫描投影图像路径", type: "VARCHAR" },

    { path: "filesystem.SAR投影图像.SAR投影图像ID", type: "VARCHAR" },
    { path: "filesystem.SAR投影图像.SAR投影图像名称", type: "VARCHAR" },
    { path: "filesystem.SAR投影图像.SAR投影图像路径", type: "VARCHAR" },
    {
      path: "filesystem.多光谱高光谱图像.多光谱高光谱图像ID",
      type: "VARCHAR",
    },
    {
      path: "filesystem.多光谱高光谱图像.多光谱高光谱图像名称",
      type: "VARCHAR",
    },
    {
      path: "filesystem.多光谱高光谱图像.多光谱高光谱图像路径",
      type: "VARCHAR",
    },

    { path: "filesystem.热红外成像图像.热红外成像图像ID", type: "VARCHAR" },
    { path: "filesystem.热红外成像图像.热红外成像图像名称", type: "VARCHAR" },
    { path: "filesystem.热红外成像图像.热红外成像图像路径", type: "VARCHAR" },

    { path: "filesystem.激光雷达图像.激光雷达图像ID", type: "VARCHAR" },
    { path: "filesystem.激光雷达图像.激光雷达图像名称", type: "VARCHAR" },
    { path: "filesystem.激光雷达图像.激光雷达图像路径", type: "VARCHAR" },
    { path: "filesystem.激光雷达图像.飞机信息.型号", type: "VARCHAR" }, // 网状图，关联展示使用

    { path: "filesystem.一般图像.一般图像ID", type: "VARCHAR" },
    { path: "filesystem.一般图像.一般图像名称", type: "VARCHAR" },
    { path: "filesystem.一般图像.一般图像路径", type: "VARCHAR" },
    { path: "filesystem.一般图像.一般图像类型", type: "VARCHAR" },

    { path: "filesystem.一般文档.一般文档ID", type: "VARCHAR" },
    { path: "filesystem.一般文档.一般文档名称", type: "VARCHAR" },
    { path: "filesystem.一般文档.一般文档路径", type: "VARCHAR" },
  ],
  outfiles: [
    {
      id: 1,
      fileName: "/images/sample1.jpg",
      filePath: "/images/sample1.jpg",
    },
    {
      id: 2,
      fileName: "/images/sample2.jpg",
      filePath: "/images/sample2.jpg",
    },
    {
      id: 3,
      fileName: "/images/sample3.jpg",
      filePath: "/images/sample3.jpg",
    },
  ],
  // // 模式画像数据
  // portraitData: {
  //   mysql: {/* MySQL树状图数据结构 */},
  //   mongodb: {/* MongoDB树状图数据结构 */},
  //   iotdb: {/* IoTDB树状图数据结构 */},
  //   filesystem: {/* 文件系统树状图数据结构 */}
  // },

  // // 模式匹配数据
  // puzzleData: {
  //   patterns: ['模式A', '模式B', '模式C'],
  //   matchResults: [
  //     { path: '/data/images/pattern1.jpg', type: '图像数据' },
  //     { path: '/data/documents/pattern2.doc', type: '文档数据' }
  //   ]
  // },

  // // 图像面板数据
  // imageData: {
  //   'stereo-projection': {
  //     total: 156,
  //     images: Array(5).fill(null).map((_, i) => ({
  //       url: `/images/stereo/image${i + 1}.jpg`,
  //       name: `Stereo_${String(i + 1).padStart(3, '0')}`,
  //       size: '2.3MB'
  //     }))
  //   },
  //   'scan-projection': {
  //     total: 234,
  //     images: Array(5).fill(null).map((_, i) => ({
  //       url: `/images/scan/image${i + 1}.jpg`,
  //       name: `Scan_${String(i + 1).padStart(3, '0')}`,
  //       size: '1.8MB'
  //     }))
  //   }
  //   // ... 其他图像类型数据
  // },

  // // 集群信息数据
  // clusterData: {
  //   storageNodes: [
  //     { id: 1, ip: '192.168.1.100', port: 8080 },
  //     { id: 2, ip: '192.168.1.101', port: 8080 }
  //   ],
  //   clusterNodes: [
  //     { id: 1, ip: '192.168.1.100', port: 8080, type: 'Master' },
  //     { id: 2, ip: '192.168.1.101', port: 8080, type: 'Slave' }
  //   ]
  // }
};

// API 接口
const api = {
  // 集群信息接口
  cluster: {
    async getClusterInfo() {
      try {
        const response = await fetch(`${API_BASE_URL}/clusterInfo`);
        return await response.json();
      } catch (error) {
        console.error("获取数据源统计失败:", error);
        return mockData.clusterData;
      }
    },
  },

  // 模式提取接口
  showColumns: {
    async getColumns(searchValue) {
      try {
        if (!searchValue) {
          searchValue = "*";
        }
        const response = await fetch(
          `${API_BASE_URL}/showColumns?searchValue=${searchValue}`
        );
        return await response.json();
      } catch (error) {
        console.error("获取数据源统计失败:", error);
        return mockData.columns;
      }
    },
  },

  outfiles: {
    getOutFiles(sql) {
      try {
        const response = fetch(`${API_BASE_URL}/outfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: sql,
        });
        return response.json();
      } catch (error) {
        console.error("获取数据失败:", error);
        return mockData.outfiles;
      }
    },
  },

  // // 模式画像相关接口
  // portrait: {
  //   async getPatternPortrait() {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/extraction/stats`);
  //       return await response.json();
  //     } catch (error) {
  //       console.error("获取模式画像失败:", error);
  //       return mockData.showColumnsData;
  //     }
  //   },
  // },

  // // 模式匹配相关接口
  // puzzle: {
  //   async getPatterns() {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/puzzle/patterns`);
  //       return await response.json();
  //     } catch (error) {
  //       console.error('获取模式列表失败:', error);
  //       return mockData.puzzleData.patterns;
  //     }
  //   },

  //   async searchPattern(pattern) {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/puzzle/search?pattern=${pattern}`);
  //       return await response.json();
  //     } catch (error) {
  //       console.error('模式搜索失败:', error);
  //       return mockData.puzzleData.matchResults;
  //     }
  //   }
  // },

  // // 图像相关接口
  // images: {
  //   async getImageTypeData(type) {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/images/${type}`);
  //       return await response.json();
  //     } catch (error) {
  //       console.error(`获取${type}图像数据失败:`, error);
  //       return mockData.imageData[type];
  //     }
  //   }
  // },

  // // 集群信息相关接口
  // cluster: {
  //   async getClusterInfo() {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/cluster/info`);
  //       return await response.json();
  //     } catch (error) {
  //       console.error('获取集群信息失败:', error);
  //       return mockData.clusterData;
  //     }
  //   }
  // }
};

// 导出接口和 mock 数据
export { api, mockData, PatternData, dbTypeMap };
