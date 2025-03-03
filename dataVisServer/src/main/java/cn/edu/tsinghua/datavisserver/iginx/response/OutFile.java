package cn.edu.tsinghua.datavisserver.iginx.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OutFile {
    private int id;
    private String fileName;
    private String filePath;
}
