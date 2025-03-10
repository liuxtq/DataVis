package cn.edu.tsinghua.hzfile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SearchDataRequest {
    @JsonProperty("sql")
    private String sql;
    @JsonProperty("page")
    private int currentPage;
    @JsonProperty("pageSize")
    private int pageSize;
}
