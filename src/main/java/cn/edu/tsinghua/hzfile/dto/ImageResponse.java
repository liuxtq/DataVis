package cn.edu.tsinghua.hzfile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageResponse {
    @JsonProperty("id")
    private Long id;
    @JsonProperty("targetName")
    private String targetName;
    @JsonProperty("tiffUrl")
    private String tiffUrl;
    @JsonProperty("pngUrl")
    private String pngUrl;
}
