package cn.edu.tsinghua.hzfile.dto.recommender;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Preference {
    @JsonProperty("category")
    private String category;

    @JsonProperty("value")
    private String value;
}
