package cn.edu.tsinghua.hzfile.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomePageController
{
    @RequestMapping("/index")
    public String index() {
        return "index.html";
    }
}
