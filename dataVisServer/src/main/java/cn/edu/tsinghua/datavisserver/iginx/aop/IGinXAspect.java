package cn.edu.tsinghua.datavisserver.iginx.aop;

import cn.edu.tsinghua.iginx.exception.SessionException;
import cn.edu.tsinghua.iginx.session.Session;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Aspect
@Component
public class IGinXAspect {
    @Resource
    Session session;

    @Pointcut("@annotation(cn.edu.tsinghua.datavisserver.iginx.annotation.IGinX)")
    public void iginxPointcut() {}

    @Before("iginxPointcut()")
    public void beforeAdvice(JoinPoint joinPoint) {
        try {
            if(session.isClosed()){
                session.openSession();
            }
        } catch (SessionException e) {

            System.out.println("Can not open session successfully.");
        }
        System.out.println("IGinx 拦截器 - 方法执行前：" + joinPoint.getSignature().getName());
    }

    @After("iginxPointcut()")
    public void afterAdvice(JoinPoint joinPoint) {
        try {
            if (session != null) {
                session.closeSession();
            }

        } catch (SessionException e) {
            System.out.println("Can not close session successfully.");
        }
        System.out.println("IGinx 拦截器 - 方法执行后：" + joinPoint.getSignature().getName());
    }
}