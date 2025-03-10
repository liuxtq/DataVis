package cn.edu.tsinghua.hzfile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ImageReqeust {
    @JsonProperty("TargetName")
    private String targetName;

    @JsonProperty("SearchTime")
    private Long searchTime;

    @JsonProperty("Country")
    private String country;

    @JsonProperty("Resolution")
    private Double resolution;

    @JsonProperty("SatelliteType")
    private String satellite;
}
