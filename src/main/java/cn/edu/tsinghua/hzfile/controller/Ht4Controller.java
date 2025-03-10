package cn.edu.tsinghua.hzfile.controller;

import cn.edu.tsinghua.hzfile.annotiation.UserAction;
import cn.edu.tsinghua.hzfile.dto.Bw;
import cn.edu.tsinghua.hzfile.dto.ImageReqeust;
import cn.edu.tsinghua.hzfile.dto.ImageResponse;
import cn.edu.tsinghua.hzfile.dto.Mission;
import cn.edu.tsinghua.iginx.exception.SessionException;
import cn.edu.tsinghua.iginx.session.Column;
import cn.edu.tsinghua.iginx.session.Session;
import cn.edu.tsinghua.iginx.session.SessionExecuteSqlResult;
import cn.edu.tsinghua.iginx.thrift.DataType;
import cn.edu.tsinghua.iginx.utils.FormatUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.net.URL;

@RestController
public class Ht4Controller {
    @Resource
    Session session;
    @Value("${mission.path}")
    private String MISSION_FILE_PATH;
    @Value("${image.path}")
    private String IMAGE_FILE_PATH;
    @Value("${searchImage.path}")
    private String SEARCH_IMAGE_PATH;

    public static final String FILE_HOST ="http://192.168.121.4:8091";
    @UserAction
    @PostMapping("/queryImages")
    public List<ImageResponse> getImages(@RequestBody ImageReqeust reqeust) throws SessionException {
        StringBuilder sb = new StringBuilder("select key,targetName,tiffUrl,pngUrl from kt2.images where 1=1");
        if(reqeust.getTargetName()!= null && !reqeust.getTargetName().isEmpty()){
            //^.*标1.*
            String pattern = "^.*%s.*";

            sb.append(" and targetName like '").append(String.format(pattern,reqeust.getTargetName())).append("'");
        }
        if (reqeust.getSearchTime() != null){
            sb.append(" and searchTime = ").append(reqeust.getSearchTime());
        }
        if (reqeust.getCountry()!= null && !reqeust.getCountry().isEmpty()){
            sb.append(" and country= '").append(reqeust.getCountry()).append("'");
        }
        if(reqeust.getResolution() != null){
            sb.append(" and resolution=").append(reqeust.getResolution());
        }
        if (reqeust.getSatellite()!= null && !reqeust.getSatellite().isEmpty()){
            sb.append(" and satellite= '").append(reqeust.getSatellite()).append("'");
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

    /**
     * 以图搜图(按钮) - 通过文件路径搜
     * @param path
     * @return
     * @throws SessionException
     */
    @GetMapping("/queryImage")
    public List<ImageResponse> getImageById(@RequestParam String path) throws SessionException {
        if(path.indexOf(FILE_HOST + "/images/")!=0){
            return Collections.emptyList();
        }
        path = path.replace(FILE_HOST + "/images/",IMAGE_FILE_PATH);
        Long key = System.currentTimeMillis();
        String sql = "insert into kt2.picToPic (key, filePath) values (%d,'%s');";
        SessionExecuteSqlResult sqlResult = session.executeSql(String.format(sql, key, path));
        String parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }


        // 调用以图搜图算法，
        sqlResult = session.executeSql("select img(filePath) from kt2.picToPic where key = "+key+";");
        parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }
        List<List<String>> queryList =
                sqlResult.getResultInList(
                        false, FormatUtils.DEFAULT_TIME_FORMAT, "ns");
        String targetNames = queryList.stream().skip(1).map(column -> column.get(1)).findFirst().get();
        String collect = Arrays.stream(targetNames.split(",")).map(item -> "targetName = '" + item + "'").collect(Collectors.joining(" or "));

        // 查询关联图片
        sqlResult = session.executeSql("select key,targetName,tiffUrl,pngUrl from kt2.images where 1=1 and (" +collect + ");");
        parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }
        queryList =
                sqlResult.getResultInList(
                        false, FormatUtils.DEFAULT_TIME_FORMAT, "ns");


        return queryList.stream().skip(1).map(column -> new ImageResponse(Long.valueOf(column.get(0)),column.get(1),column.get(2),column.get(3)))
                .collect(Collectors.toList());
    }

    /**
     * 以图搜图-通过上传图片搜
      */
    @PostMapping("/queryImagesByUpload")
    public List<ImageResponse> uploadImage(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return Collections.emptyList();
        }

        // 检查文件类型
        if (!image.getContentType().startsWith("image/")) {
            return Collections.emptyList();
        }

        // 设置存储路径
        File uploadPath = new File(SEARCH_IMAGE_PATH);
        if (!uploadPath.exists()) {
            uploadPath.mkdirs(); // 创建目录
        }

        String fileName = System.currentTimeMillis() + "-" + image.getOriginalFilename();
        File destFile = new File(SEARCH_IMAGE_PATH + fileName);

        try {
            image.transferTo(destFile); // 保存文件
            return this.getImageById(FILE_HOST + "/images/searchImage/" + fileName);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    /**
     * 查询报文
     * @return
     * @throws SessionException
     */
    @UserAction
    @GetMapping("/queryBw")
    public List<Bw> getBw(@RequestParam(required = false) String content) throws SessionException {
        StringBuilder sb = new StringBuilder("select content,create_time from kt2.bw where 1=1 ");
        if(content!= null && !content.isEmpty()){
            //^.*标1.*
            String pattern = "^.*%s.*";
            sb.append(" and content like '").append(String.format(pattern,content)).append("'");
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


    @PostMapping("/mission")
    public String saveKt3Task(@RequestBody Mission mission) throws SessionException {
        String url = downloadFile(mission.getPicUrl());
        String sql = "insert into kt2.mission (key, missionID,time,result,picUrl) values (%d,'%s',%d,'%s','%s');";
        SessionExecuteSqlResult sqlResult = session.executeSql(String.format(sql, System.currentTimeMillis(),mission.getMissionId(),mission.getTime(),mission.getResult(),url));
        String parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }

        return mission.getMissionId();
    }


    @GetMapping("/mission")
    public List<Mission> getKt3Result(@RequestParam String missionID) throws SessionException {
        String sql = "select missionID,time,result,picUrl from kt2.mission where missionID = '%s';";

        SessionExecuteSqlResult sqlResult = session.executeSql(String.format(sql, missionID));
        String parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }
        List<List<String>> queryList =
                sqlResult.getResultInList(
                        false, FormatUtils.DEFAULT_TIME_FORMAT, "ns");
        return queryList.stream().skip(1).map(task -> new Mission(task.get(1),Long.parseLong(task.get(2)),task.get(3),task.get(4)))
                .collect(Collectors.toList());
    }

    public String downloadFile(String url) {
        try {

            // 确保 URL 是有效的
            if (url == null || url.isEmpty()) {
                return null;
            }
            // 创建 URL 对象
            URL fileURL;
            try {
                fileURL = new URL(url);;
            } catch (Exception e) {
                // 如果 URL 格式不正确，直接返回 null
                return null;
            }

            // 获取 URL 的路径部分
            String path = fileURL.getPath();

            // 如果路径为空，返回 null
            if (path == null || path.isEmpty()) {
                return null;
            }
            int lastIndex = url.lastIndexOf('/');
            String filePath = MISSION_FILE_PATH +"/"+url.substring(lastIndex + 1);
            String fileUrl =  FILE_HOST+ "/mission/"+url.substring(lastIndex + 1);
            // 使用 NIO 下载文件
            try (InputStream in = fileURL.openStream();
                 ReadableByteChannel rbc = Channels.newChannel(in);
                 FileOutputStream fos = new FileOutputStream(filePath)) {
                fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
            }

            return fileUrl;
        } catch (Exception e) {
            return "下载文件时发生错误: " + e.getMessage();
        }
    }
}
