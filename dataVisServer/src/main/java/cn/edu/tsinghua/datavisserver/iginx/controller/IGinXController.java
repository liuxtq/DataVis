package cn.edu.tsinghua.datavisserver.iginx.controller;

import cn.edu.tsinghua.datavisserver.iginx.annotation.IGinX;
import cn.edu.tsinghua.datavisserver.iginx.response.OutFile;
import cn.edu.tsinghua.iginx.constant.GlobalConstant;
import cn.edu.tsinghua.iginx.exception.SessionException;
import cn.edu.tsinghua.iginx.session.*;
import cn.edu.tsinghua.iginx.thrift.DataType;
import cn.edu.tsinghua.iginx.thrift.Status;
import cn.edu.tsinghua.iginx.utils.FormatUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.*;
import java.nio.file.*;
import java.security.InvalidParameterException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static cn.edu.tsinghua.iginx.utils.FileUtils.exportByteStream;

@RestController
public class IGinXController {

    @Resource
    Session session;

    @GetMapping("/clusterInfo")
    public ClusterInfo getClusterInfo() throws SessionException {
        return session.getClusterInfo();
    }

    @GetMapping("/showColumns")
    public List<Column> showColumns(@RequestParam(name = "searchValue") String searchValue) throws SessionException {
        SessionExecuteSqlResult sqlResult = session.executeSql(String.format("show columns %s;",searchValue));
        String parseErrorMsg = sqlResult.getParseErrorMsg();
        if (parseErrorMsg != null && !parseErrorMsg.isEmpty()) {
            throw new SessionException(sqlResult.getParseErrorMsg());
        }
        List<List<String>> queryList =
                sqlResult.getResultInList(
                        false, FormatUtils.DEFAULT_TIME_FORMAT, "ns");

        return queryList.stream().skip(1).map(column -> new Column(column.get(0), DataType.valueOf(column.get(1))))
                .collect(Collectors.toList());
    }
    @PostMapping("outfile")
    public List<OutFile> outfile(@RequestBody String sql) throws SessionException, IOException {
        String outfileRegex =
                "(?i)\\bINTO\\s+OUTFILE\\s+\"(.*?)\"\\s+AS\\s+STREAM(?:\\s+showimg\\s+(true|false))?\\s*;$";
        Pattern pattern = Pattern.compile(outfileRegex);
        Matcher matcher = pattern.matcher(sql.toLowerCase());
        if (matcher.find()) {
            if (matcher.group(2) != null)
                if (matcher.group(2).equals("true"))
                    return processOutfileSql(sql, matcher.group(1), true);
                else return processOutfileSql(sql, matcher.group(1), false);
            else return processOutfileSql(sql, matcher.group(1), false);
        }
        return null;
    }

    private String outfileDir = "./static";
    private String outfileRegex =
            "(?i)(\\bINTO\\s+OUTFILE\\s+\")(.*?)(\"\\s+AS\\s+STREAM)(?:\\s+showimg\\s+(true|false))?\\s*;$";
    private String fetchSize = "1000";
    private int outfileMaxNum = 100;
    private int outfileMaxSize = 10240;
    private Queue<String> downloadFileQueue = new LinkedList<>();
    private Queue<Double> downloadFileSizeQueue = new LinkedList<>();
    private double downloadFileTotalSize = 0L;

    private List<OutFile> processOutfileSql(String sql, String originOutfilePath, Boolean showimg)
            throws SessionException, IOException {

        // 根据当前年月日时分秒毫秒生成outfile的文件夹名，将文件下载到此处
        String dateDir = new Date().toString().replace(" ", "-").replace(":", "-");
        String outfileDirPath = Paths.get(outfileDir, dateDir).toString();
        File outfileFolder = new File(outfileDirPath);
        if (!outfileFolder.exists()) {
            outfileFolder.mkdirs();
        }

        if (!outfileFolder.isDirectory()) {
            throw new IOException(String.format("Path %s is supposed to be a dir.", outfileDirPath));
        }

        // 替换sql中最后一个outfile关键词，替换文件路径为Zeppelin在服务端指定的路径
        Pattern pattern = Pattern.compile(outfileRegex);
        Matcher matcher = pattern.matcher(sql);
        if (matcher.find()) {
            int lastMatchEnd = 0;
            while (matcher.find()) {
                lastMatchEnd = matcher.end(); // 记录匹配结束的位置
            }

            // 替换最后一个匹配的路径
            sql =
                    sql.substring(0, lastMatchEnd)
                            + sql.substring(lastMatchEnd) // on windows, '\' in path needs to be replaced by "\\".
                            .replaceFirst(outfileRegex, "$1" + outfileDirPath.replace("\\", "\\\\") + "$3;");
        }

        QueryDataSet res = session.executeQuery(sql);

        processExportByteStream(res);

        // 获取outfileDirPath文件夹下的所有文件名，只有一级，不需要递归
        String[] fileNames = outfileFolder.list();

        // 如果有多个文件，压缩outfileDirPath文件夹
        boolean hasMultipleFiles = fileNames != null && fileNames.length > 1;
        String zipName = "all_file.zip";
        if (hasMultipleFiles) {
            FileOutputStream outputStream =
                    new FileOutputStream(Paths.get(outfileDirPath, zipName).toString());
            ArrayList<File> fileList = new ArrayList<>();
            for (String fileName : fileNames) {
                fileList.add(new File(outfileDirPath + "/" + fileName));
            }
            toZip(fileList, outputStream);
            outputStream.close();
        }

        // 清理NGINX_STATIC文件夹
        downloadFileQueue.add(outfileDirPath);
        double fileSize = getFileSize(outfileDirPath);
        downloadFileSizeQueue.add(fileSize);
        downloadFileTotalSize += fileSize;
        clearNGINXStaticFiles();

        if (showimg) {
            if (fileNames != null) {
                String[] IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "bmp", "tiff"};
                for (String fileName : fileNames) {
                    for (String ext : IMAGE_EXTENSIONS) {
                        if (fileName.endsWith("." + ext)) {
                            byte[] imageBytes = Files.readAllBytes(Paths.get(outfileDirPath + "/" + fileName));
                            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                            break;
                        }
                    }
                }
            }
        }
        List<OutFile> result = new ArrayList<>();
        // 构建表格
        String downloadLink = "<a href=\"%s\" download=\"%s\">点击下载</a>";
        int id=0;
        String httpPrefix =
                "http://" + "localIpAddress" + ":" + "fileHttpPort" + "SimpleFileServer.PREFIX" + "/";
        if (hasMultipleFiles) {
            result.add(OutFile.builder().id(id++).fileName("所有文件压缩包").filePath(httpPrefix + Paths.get(dateDir, zipName)).build());
        }
        if (fileNames != null) {
            for (String fileName : fileNames) {
                result.add(OutFile.builder().id(id++).fileName(fileName).filePath(httpPrefix + Paths.get(dateDir, fileName)).build());
            }
        }
        return result;
    }


    /**
     * 将QueryDataSet中的结果导出到文件中。 拷贝自Client模块的Outfile相关代码，因为Client模块不能被引用
     *
     * @param res QueryDataSet
     * @throws SessionException
     * @throws IOException
     */
    private void processExportByteStream(QueryDataSet res) throws SessionException, IOException {
        String dir = res.getExportStreamDir();

        File dirFile = new File(dir);
        if (!dirFile.exists()) {
            Files.createDirectory(Paths.get(dir));
        }
        if (!dirFile.isDirectory()) {
            throw new InvalidParameterException(dir + " is not a directory!");
        }

        int columnsSize = res.getColumnList().size();
        int finalCnt = columnsSize;
        String[] columns = new String[columnsSize];
        Map<String, Integer> countMap = new HashMap<>();
        for (int i = 0; i < columnsSize; i++) {
            String originColumn = res.getColumnList().get(i);
            if (originColumn.equals(GlobalConstant.KEY_NAME)) {
                columns[i] = "";
                finalCnt--;
                continue;
            }
            // 将文件名中的反斜杠\替换为.，因为web路径不能识别\
            originColumn = originColumn.replace("\\", ".");

            Integer count = countMap.getOrDefault(originColumn, 0);
            count += 1;
            countMap.put(originColumn, count);
            // 重复的列名在列名后面加上(1),(2)...
            if (count >= 2) {
                columns[i] = Paths.get(dir, originColumn + "(" + (count - 1) + ")").toString();
            } else {
                columns[i] = Paths.get(dir, originColumn).toString();
            }
            // 若将要写入的文件存在，删除之
            Files.deleteIfExists(Paths.get(columns[i]));
        }

        while (res.hasMore()) {
            List<List<byte[]>> cache = cacheResultByteArray(res);
            exportByteStream(cache, columns);
        }
        res.close();

        System.out.println(
                "Successfully write "
                        + finalCnt
                        + " file(s) to directory: \""
                        + dirFile.getAbsolutePath()
                        + "\".");
    }
    /**
     * 将给定的文件列表压缩成zip文件，输出到给定的输出流中
     *
     * @param srcFiles 文件列表
     * @param out 输出流
     * @throws RuntimeException
     */
    public static void toZip(List<File> srcFiles, OutputStream out) throws RuntimeException {
        int BUFFER_SIZE = 2 * 1024;
        ZipOutputStream zos = null;
        try {
            zos = new ZipOutputStream(out);
            for (File srcFile : srcFiles) {
                byte[] buf = new byte[BUFFER_SIZE];
                zos.putNextEntry(new ZipEntry(srcFile.getName()));
                int len;
                FileInputStream in = new FileInputStream(srcFile);
                while ((len = in.read(buf)) != -1) {
                    zos.write(buf, 0, len);
                }
                zos.closeEntry();
                in.close();
            }
        } catch (Exception e) {
            throw new RuntimeException("zip error", e);
        } finally {
            if (zos != null) {
                try {
                    zos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    /**
     * 获取文件夹下所有文件的大小(MB)
     *
     * @param path 文件夹路径
     * @return 文件夹下所有文件的大小(MB)
     * @throws IOException
     */
    private double getFileSize(String path) throws IOException {
        final double[] fileSize = {0L};
        Files.walkFileTree(
                Paths.get(path),
                new SimpleFileVisitor<Path>() {
                    @Override
                    public FileVisitResult visitFile(
                            Path file, java.nio.file.attribute.BasicFileAttributes attrs) throws IOException {
                        fileSize[0] += Files.size(file) / 1024.0 / 1024.0;
                        return FileVisitResult.CONTINUE;
                    }
                });

        return fileSize[0];
    }
    /**
     * 清理NGINX_STATIC文件夹，如果NGINX_STATIC文件夹中的文件夹数量或大小超过一定数量，清理掉最早的文件夹，直到文件夹数量和大小小于一定数量
     * 不清除当前下载的文件夹（即最新的文件夹）
     */
    private void clearNGINXStaticFiles() throws IOException {
        File nginxStaticFolder = new File(outfileDir);
        if (!nginxStaticFolder.exists() || !nginxStaticFolder.isDirectory()) {
            return;
        }
        // 检查NGINX_STATIC文件夹下的文件夹数量和大小
        while ((downloadFileQueue.size() > outfileMaxNum || downloadFileTotalSize > outfileMaxSize)
                && downloadFileQueue.size() > 1) {
            String oldestFolder = downloadFileQueue.poll();
            double oldestFileSize = downloadFileSizeQueue.poll();
            downloadFileTotalSize -= oldestFileSize;
            if (oldestFolder != null) {
                Files.walkFileTree(
                        Paths.get(oldestFolder),
                        new SimpleFileVisitor<Path>() {
                            @Override
                            public FileVisitResult visitFile(
                                    Path file, java.nio.file.attribute.BasicFileAttributes attrs) throws IOException {
                                Files.delete(file);
                                return FileVisitResult.CONTINUE;
                            }

                            @Override
                            public FileVisitResult postVisitDirectory(Path dir, IOException exc)
                                    throws IOException {
                                Files.delete(dir);
                                return FileVisitResult.CONTINUE;
                            }
                        });
            }
        }
    }
    /**
     * 将QueryDataSet中的结果缓存到List<List<byte[]>>中，每一行为一个List<byte[]>，每一列为一个byte[]
     * 拷贝自Client模块的Outfile相关代码，因为Client模块不能被引用
     *
     * @param queryDataSet QueryDataSet
     * @return 缓存结果
     * @throws SessionException
     */
    private List<List<byte[]>> cacheResultByteArray(QueryDataSet queryDataSet)
            throws SessionException {
        List<List<byte[]>> cache = new ArrayList<>();
        int rowIndex = 0;
        while (queryDataSet.hasMore() && rowIndex < Integer.parseInt(fetchSize)) {
            List<byte[]> nextRow = queryDataSet.nextRowAsBytes();
            if (nextRow != null) {
                cache.add(nextRow);
                rowIndex++;
            }
        }
        return cache;
    }
}
