package cn.edu.tsinghua.hzfile.dto.recommender;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommendSetting {
    @JsonProperty("key")
    private Long key;

    @JsonProperty("owner")
    private String owner;

    @JsonProperty("preferences")
    private List<Preference> preferences;

    @JsonProperty("reportContent")
    private String reportContent;
}

