package cn.edu.tsinghua.datavisserver.iginx.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 所有的请求路径
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 允许的请求方法
                .allowedHeaders("*")  // 允许所有的请求头
                .allowCredentials(true)  // 是否允许带上身份信息
                .maxAge(3600);  // 缓存CORS预检请求的时间，单位是秒
    }
}