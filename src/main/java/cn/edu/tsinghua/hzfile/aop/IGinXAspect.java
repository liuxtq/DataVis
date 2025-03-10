package cn.edu.tsinghua.hzfile.aop;

import cn.edu.tsinghua.hzfile.dto.ImageReqeust;
import cn.edu.tsinghua.hzfile.service.HttpService;
import cn.edu.tsinghua.hzfile.util.Constant;
import cn.edu.tsinghua.iginx.exception.SessionException;
import cn.edu.tsinghua.iginx.session.Session;
import com.alibaba.fastjson2.JSONObject;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;

@Aspect
@Component
public class IGinXAspect {
    private static final Logger logger = LoggerFactory.getLogger(IGinXAspect.class);
    @Resource
    Session session;
    @Resource
    HttpService httpService;

    @Pointcut("@annotation(cn.edu.tsinghua.hzfile.annotiation.UserAction)")
    public void userSpecPointcut() {}

    @Before("userSpecPointcut()")
    public void beforeAdvice(JoinPoint joinPoint) {
        try {
            Object[] args = joinPoint.getArgs();

                StringBuilder sb = new StringBuilder("insert into kt2.user.action (key, yy,mm,dd,hh,mi,ss,owner,statement,processed,table_column_dict,table_table_dict)");

                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                String clientIp = "127.0.0.1";
                if (attributes != null) {
                    HttpServletRequest request = attributes.getRequest();
                    // 获取客户端IP地址
                    clientIp = httpService.getClientIp(request);

                }
                //
                LocalDateTime now = LocalDateTime.now();
                int yy = now.getYear(),mm=now.getMonthValue(),dd=now.getDayOfMonth(),hh=now.getHour(),mi=now.getMinute(),ss=now.getSecond();
                String methodName = joinPoint.getSignature().getName();
                String statement ;
                JSONObject tableColumnDict = new JSONObject();
                JSONObject tableTableDict = new JSONObject();
                if(methodName.equals("getImages")){
                    ImageReqeust obj = (ImageReqeust)args[0]; // 获取第一个参数（Object类型）
                    ArrayList<String> tableColumnList = new ArrayList<>();
                    String project = "";
                    if(obj.getTargetName() !=null && !obj.getTargetName().isEmpty()){
                        project += "targetName"+ Constant.SEPARATOR +obj.getTargetName() + ",";
                        tableColumnList.add("targetName"+ Constant.SEPARATOR +obj.getTargetName());
                    }
                    if(obj.getCountry() !=null && !obj.getCountry().isEmpty()){
                        project += "country"+ Constant.SEPARATOR +obj.getCountry() + ",";
                        tableColumnList.add("country"+ Constant.SEPARATOR +obj.getCountry());
                    }
                    if(obj.getSatellite() !=null && !obj.getSatellite().isEmpty()){
                        project += "satellite"+ Constant.SEPARATOR +obj.getSatellite() + ",";
                        tableColumnList.add("satellite"+ Constant.SEPARATOR +obj.getSatellite());
                    }

                    statement = "select " + project.substring(0,project.length()-1)+" from kt2.images"; //kt2.use.action
                    tableColumnDict.put("kt2.images", tableColumnList);
                    tableTableDict.put("kt2.images",Arrays.asList("kt2.images"));
                }else if(methodName.equals("getBw")){
                    String content = (String)args[0];
                    if(content==null || content.isEmpty()){
                        return;
                    }
                    statement = "select "+"content"+ Constant.SEPARATOR +content+" from kt2.bw"; //kt2.use.action
                    tableColumnDict.put("kt2.bw", Arrays.asList("content"+ Constant.SEPARATOR +content)); // 查询报文目前没有查询参数，所以默认用字段名 content
                    tableTableDict.put("kt2.bw",Arrays.asList("kt2.bw"));
                }else{
                    logger.warn("user action not saved for {}",methodName);
                    return;
                }

                sb.append(" values (").append(System.currentTimeMillis()).append(",").append(yy).append(",").append(mm).append(",").append(dd).append(",").append(hh).append(",").append(mi).append(",").append(ss).append(",'").append(clientIp).append("','").append(statement).append("','").append(statement).append("','").append(tableColumnDict).append("','").append(tableTableDict).append("');");
                session.executeSql(sb.toString());
                logger.info("user action saved for {}",methodName);
        } catch (SessionException e) {

            System.out.println("Can not open session successfully.");
        }
    }

    @After("userSpecPointcut()")
    public void afterAdvice(JoinPoint joinPoint) {

    }
    
}