package cn.edu.tsinghua.hzfile.config.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${mission.path}")
    private String missionPath;
    @Value("${image.path}")
    private String imagePath;
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将 /assets/** 映射到 /static/images
//        registry.addResourceHandler("/assets/**")
//                .addResourceLocations("classpath:/static/images/");


        // 将 /external/** 映射到 /home/user/static_resources/ 目录
//        registry.addResourceHandler("/external/**")
//                .addResourceLocations("file:///D:/"); // 外部文件夹路径



        // 将 /external1/** 映射到 /path/to/external1/
        registry.addResourceHandler("/images/**")
//
                .addResourceLocations("file:"+imagePath);

        // 将 /external2/** 映射到 /path/to/external2/
        registry.addResourceHandler("/mission/**")
                .addResourceLocations("file:"+missionPath);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 所有的请求路径
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 允许的请求方法
                .allowedHeaders("*")  // 允许所有的请求头
                .allowCredentials(true)  // 是否允许带上身份信息
                .maxAge(3600);  // 缓存CORS预检请求的时间，单位是秒
    }

}
