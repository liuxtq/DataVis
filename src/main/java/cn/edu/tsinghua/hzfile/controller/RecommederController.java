package cn.edu.tsinghua.hzfile.controller;

import cn.edu.tsinghua.hzfile.aop.IGinXAspect;
import cn.edu.tsinghua.hzfile.dto.Bw;
import cn.edu.tsinghua.hzfile.dto.ImageReqeust;
import cn.edu.tsinghua.hzfile.dto.ImageResponse;
import cn.edu.tsinghua.hzfile.dto.recommender.Preference;
import cn.edu.tsinghua.hzfile.dto.recommender.RecommendSetting;
import cn.edu.tsinghua.hzfile.dto.recommender.Recommender;
import cn.edu.tsinghua.hzfile.service.CsvService;
import cn.edu.tsinghua.hzfile.service.HttpService;
import cn.edu.tsinghua.hzfile.util.Constant;
import cn.edu.tsinghua.iginx.exception.SessionException;
import cn.edu.tsinghua.iginx.session.Session;
import cn.edu.tsinghua.iginx.session.SessionExecuteSqlResult;
import cn.edu.tsinghua.iginx.utils.FormatUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class RecommederController {
    private static final Logger logger = LoggerFactory.getLogger(RecommederController.class);
    @Resource
    Session session;
    @Resource
    HttpService httpService;
    @Value("${recommender.path}")
    private String RECOMMENDER_PATH="D:/workspace/python_workspace/SqlRecommender/SqlRecommender/";
    @Value("${python.path}")
    private String PYTHON_PATH = "D:/ProgramData/miniconda3/envs/3.8/pythondsafd";
    /**
     * 保存推荐偏好设置
     * @param recom
     * @return
     * @throws SessionException
     */
    @PostMapping("/recommendationSetting")
    public String submitReport(@RequestBody RecommendSetting recom) throws SessionException {
        long key = recom.getKey()==null?System.currentTimeMillis():recom.getKey();
        String owner = recom.getOwner()==null?getClientIp():recom.getOwner();
        recom.setKey(key);
        recom.setOwner(owner);

        String recommendSettingStr = "";
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            recommendSettingStr = objectMapper.writeValueAsString(recom);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        String sql = "INSERT INTO kt2.recommendation.setting (key, owner,setting) VALUES (" +
                key + ", " +
                "'" + owner + "' " +
                ", '" + recommendSettingStr + "' " +
                ");";
        logger.info("保存推荐偏好设置: " + sql);
        SessionExecuteSqlResult sqlResult = session.executeSql(sql);
        String parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }
        return "succes";
    }

    @GetMapping("/recommendationSetting")
    public RecommendSetting getRecommendationSetting(@RequestParam(required = false) String clientIp) throws SessionException {
        clientIp = getClientIp();
        StringBuilder sb = new StringBuilder("select key, owner,setting from kt2.recommendation.setting where 1=1 ");
        sb.append(" and owner = '").append(clientIp);
        sb.append("' order by key desc;");

        SessionExecuteSqlResult sqlResult = session.executeSql(sb.toString());
        String parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }
        List<List<String>> queryList =
                sqlResult.getResultInList(
                        false, FormatUtils.DEFAULT_TIME_FORMAT, "ns");

        List<RecommendSetting> collect = queryList.stream().skip(1).map(column -> {
            ObjectMapper objectMapper = new ObjectMapper();
            RecommendSetting setting = new RecommendSetting();
            try {
                setting = objectMapper.readValue(column.get(2), RecommendSetting.class);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
            return setting;
        }).collect(Collectors.toList());

        return collect.size()>1?collect.get(0):null;
    }


    public String getClientIp() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String clientIp = "127.0.0.1";
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            // 获取客户端IP地址
            clientIp = httpService.getClientIp(request);

        }
        return clientIp;
    }

    /**
     * 调用推荐系统
     * @return
     * @throws Exception
     */
    @GetMapping("/recommender/training")
    public String recommenderTraining() throws Exception {
        // 将user action 保存到csv
        generateCSV();
        //删掉pkl缓存，重新建立新文件
        deleteAndRecreateFile(RECOMMENDER_PATH+"/user.pkl");
        deleteAndRecreateFile(RECOMMENDER_PATH+"/user_table_dict.pkl");

        // 调用推荐系统存储结果
        ProcessBuilder processBuilder = new ProcessBuilder(PYTHON_PATH, RECOMMENDER_PATH+"hz_training.py");
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }
        process.waitFor();
//        csvService.saveDataToCsv();
        return output.toString();
    }

    /**
     * 获取推荐信息
     * @param offset
     * @param limit
     * @return
     * @throws Exception
     */
    @GetMapping("/recommender")
    public List<Recommender> getRecommender(@RequestParam(name="offset") int offset, @RequestParam(name="limit") int limit) throws Exception {
        // 调用推荐系统存储结果
        ProcessBuilder processBuilder = new ProcessBuilder(PYTHON_PATH, RECOMMENDER_PATH+"hz_api.py",getClientIp());
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }
        process.waitFor();
        logger.info("通过推荐系统获取推荐信息{}",output.toString());
        List<Recommender> msgs = getMsgs(output.toString());

        // 通过推荐偏好设置获取推荐信息- 优先级高
        List<Recommender> msgsBySetting = getMsgsBySetting();
        msgsBySetting.addAll(msgs);

        return msgsBySetting.subList(offset,Math.min(limit,msgsBySetting.size()-offset*limit));
    }

    /**
     * 通过推荐偏好设置获取推荐信息
     * @return
     * @throws SessionException
     */
    public List<Recommender> getMsgsBySetting() throws SessionException {
        RecommendSetting recommendationSetting = this.getRecommendationSetting("");
        List<String> targetNames = recommendationSetting.getPreferences().stream().map(Preference::getValue).collect(Collectors.toList());
        String[] contents = recommendationSetting.getReportContent().split(" ");
        // ['kt2.images','kt2.bw']
        StringBuilder sb = new StringBuilder();
        targetNames.forEach(targetName -> sb.append("'").append("kt2.images.targetName").append(Constant.SEPARATOR).append(targetName).append("',"));

        for (String content : contents) {
            sb.append("'").append("kt2.bw.content").append(Constant.SEPARATOR).append(content).append("',");
        }
        String recommenderStr = "["+ sb.substring(0, sb.length()-1) +"]";
        logger.info("通过推荐偏好设置获取推荐信息{}",recommenderStr);
        return getMsgs(recommenderStr);
    }

    /**
     * 通过推荐算法获取推荐信息
     * @param recommenderStr
     * @return
     * @throws SessionException
     */
    public List<Recommender> getMsgs(String recommenderStr) throws SessionException {
        logger.info("recommenderStr = {}",recommenderStr);
        recommenderStr = recommenderStr.trim();
        String[] fields = recommenderStr.substring(1, recommenderStr.length() - 1).split(",");

        // 按表名分组字段
        Map<String, List<String>> groupedFields = new LinkedHashMap<>();

        for (String field : fields) {
            // 分割表名和字段名
            field = field.trim();
            String[] parts = field.substring(1, field.length()-1).split(Constant.SEPARATOR);
            String tableColumn = parts[0];
            logger.info(tableColumn);
            String tableName = tableColumn.substring(0,tableColumn.lastIndexOf("."));
            String columnName = tableColumn.substring(tableColumn.lastIndexOf(".")+1);
            String value = parts[1];

            // 将字段添加到对应的表名下
            groupedFields.computeIfAbsent(tableName, k -> new ArrayList<>()).add(columnName+Constant.SEPARATOR+value);
        }
        List<Recommender> recommenders = new ArrayList<>();
        // 生成查询语句
        for (Map.Entry<String, List<String>> entry : groupedFields.entrySet()) {
            String tableName = entry.getKey();
            if(tableName.equals("kt2.images")){
                List<ImageResponse> images = getImages(entry.getValue());
                recommenders.addAll(images.stream().map(image -> {
                    Recommender recommender = new Recommender();
                    recommender.setMType("识别目标");
                    recommender.setTargetName(image.getTargetName());
                    recommender.setPngUrl(image.getPngUrl());
                    return recommender;
                }).collect(Collectors.toList()));
            }else if(tableName.equals("kt2.bw")){
                List<Bw> bws = getBw(entry.getValue());
                recommenders.addAll(bws.stream().map(bw -> {
                    Recommender recommender = new Recommender();
                    recommender.setMType("航天侦察快报");
                    recommender.setMsg(bw.getContent());
                    recommender.setTime(bw.getCreate_time());
                    return recommender;
                }).collect(Collectors.toList()));
            }else{
                logger.info("Table {} not supported",tableName);
            }

        }
        return recommenders;
    }

    public List<ImageResponse> getImages(List<String> columns) throws SessionException {
        StringBuilder sb = new StringBuilder("select key,targetName,tiffUrl,pngUrl from kt2.images where 1=1 ");
        if (columns != null && !columns.isEmpty()) {
            sb.append(" and (");
            for (int i = 0; i < columns.size(); i++) {
                String[] split = columns.get(i).split(Constant.SEPARATOR);
                sb.append(split[0]).append("='").append(split[1]).append("'");
                if(i < columns.size()-1)
                    sb.append(" or ");
            }
            sb.append(" )");
        }
        sb.append(";");

        SessionExecuteSqlResult sqlResult = session.executeSql(sb.toString());
        String parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }
        List<List<String>> queryList =
                sqlResult.getResultInList(
                        false, FormatUtils.DEFAULT_TIME_FORMAT, "ns");


        return queryList.stream().skip(1).map(column -> new ImageResponse(Long.valueOf(column.get(0)),column.get(1),column.get(2),column.get(3)))
                .collect(Collectors.toList());
    }

    public List<Bw> getBw(List<String> columns) throws SessionException {
        String pattern = "^.*%s.*";
        StringBuilder sb = new StringBuilder("select content,create_time from kt2.bw where 1=1 ");
        if (columns != null && !columns.isEmpty()) {
            sb.append(" and (");
            for (int i = 0; i < columns.size(); i++) {
                String[] split = columns.get(i).split(Constant.SEPARATOR);
                sb.append(split[0]).append(" like '").append(String.format(pattern,split[1])).append("'");
                if(i < columns.size()-1)
                    sb.append(" or ");
            }
            sb.append(" )");
        }
        sb.append(";");


        SessionExecuteSqlResult sqlResult = session.executeSql(sb.toString());
        String parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }
        List<List<String>> queryList =
                sqlResult.getResultInList(
                        false, FormatUtils.DEFAULT_TIME_FORMAT, "ns");


        return queryList.stream().skip(1).map(bw -> new Bw(bw.get(1),bw.get(2)))
                .collect(Collectors.toList());
    }
    /**
     *
     */
    private boolean generateCSV() throws SessionException {
        String sql = "select yy,mm,dd,hh,mi,ss,owner,statement,processed,table_column_dict,table_table_dict from kt2.user.action;";
        SessionExecuteSqlResult sqlResult = session.executeSql(sql);
        String parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }
        List<List<String>> queryList =
                sqlResult.getResultInList(
                        false, FormatUtils.DEFAULT_TIME_FORMAT, "ns");

        queryList = removeFirstColumn(queryList);
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(Files.newOutputStream(Paths.get(RECOMMENDER_PATH+"/user_action.csv")), StandardCharsets.UTF_8));
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT)) {

//            CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(queryList.get(0))))
            writer.write("\uFEFF"); // 添加 BOM 标识
            for (int i = 0; i < queryList.size(); i++) {
                List<String> row  = queryList.get(i);
                if(i==0){
                    row = row.stream().map(col -> col.replace("kt2.user.action.", "")).collect(Collectors.toList());
                }
                csvPrinter.printRecord(row);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return true;
    }


    public static List<List<String>> removeFirstColumn(List<List<String>> data) {
        List<List<String>> result = new ArrayList<>();
        for (List<String> row : data) {
            // 使用 subList 方法去掉第一个元素
            if (row.size() > 1) {
                result.add(new ArrayList<>(row.subList(1, row.size())));
            } else {
                // 如果某一行只有一个元素，去掉后返回空行
                result.add(new ArrayList<>());
            }
        }
        return result;
    }

    // 删除文件并重新创建的方法
    public static void deleteAndRecreateFile(String filePath) {
        File file = new File(filePath);

        // 检查文件是否存在
        if (file.exists()) {
            // 删除文件
            if (file.delete()) {
                System.out.println("文件 " + filePath + " 已成功删除。");
            } else {
                System.out.println("无法删除文件 " + filePath + "。");
            }
        } else {
            System.out.println("文件 " + filePath + " 不存在，将创建新文件。");
        }

        // 重新创建文件
        try {
            if (file.createNewFile()) {
                System.out.println("文件 " + filePath + " 已成功重新创建。");
            } else {
                System.out.println("无法创建文件 " + filePath + "。");
            }
        } catch (IOException e) {
            System.out.println("创建文件时发生错误：" + e.getMessage());
        }
    }
}
