package cn.edu.tsinghua.hzfile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class SearchDataResponse {
    @JsonProperty("data")
    private List<List<String>> data;
    @JsonProperty("total")
    private int total;
}
