package cn.edu.tsinghua.datavisserver.iginx.config;

import cn.edu.tsinghua.iginx.exception.SessionException;
import cn.edu.tsinghua.iginx.session.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IGinXConfiguration {
    @Value("${iginx.host}")
    private String host;
    @Value("${iginx.port}")
    private int port;
    @Value("${iginx.username}")
    private String username;
    @Value("${iginx.password}")
    private String password;

    @Bean(destroyMethod = "closeSession")
    public Session getSession() throws SessionException{
        Session session = new Session(host, port, username, password);
        session.openSession();
        return session;
    }

}
