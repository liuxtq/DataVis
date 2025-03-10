package cn.edu.tsinghua.hzfile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Bw {

    @JsonProperty("content")
    private String content;

    @JsonProperty("create_time")
    private String create_time;
}
