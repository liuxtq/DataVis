package cn.edu.tsinghua.hzfile.schedule;
import cn.edu.tsinghua.hzfile.aop.IGinXAspect;
import cn.edu.tsinghua.hzfile.controller.RecommederController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component
public class RecommenderScheduledTask {
    private static final Logger logger = LoggerFactory.getLogger(RecommenderScheduledTask.class);

    @Resource
    RecommederController recommederController;
    @Scheduled(cron = "0 0/5 * * * ?")
    public void executeTaskWithCron() throws Exception {
        logger.info("基于Cron表达式的定时任务执行了！当前时间：{}" , new java.util.Date());
        recommederController.recommenderTraining();
    }
}


