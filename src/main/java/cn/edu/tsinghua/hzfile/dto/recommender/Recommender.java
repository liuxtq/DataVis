package cn.edu.tsinghua.hzfile.dto.recommender;

import lombok.Data;

@Data
public class Recommender {
    private String mType;

    private String targetName;

    private String pngUrl;

    private String msg;

    private String time;
}
