package cn.edu.tsinghua.hzfile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Mission {
    @JsonProperty("MissionID")
    private String missionId;
    @JsonProperty("time")
    private Long time;
    @JsonProperty("result")
    private String result;
    @JsonProperty("picUrl")
    private String picUrl;
}
