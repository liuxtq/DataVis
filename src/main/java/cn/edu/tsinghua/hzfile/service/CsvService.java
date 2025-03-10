package cn.edu.tsinghua.hzfile.service;

import cn.edu.tsinghua.iginx.session.Session;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvService {
    @Resource
    Session session;
    // 示例：将查询到的数据保存到CSV文件
    public void saveDataToCsv() throws IOException {
        // 假设这是从数据库中查询到的数据
        List<String[]> data = fetchDataFromDatabase();

        // CSV文件路径
        String csvFilePath = "output.csv";

        // 创建CSVWriter对象
        try (CSVWriter writer = new CSVWriter(new FileWriter(csvFilePath))) {
            // 写入列名
            String[] header = {"ID", "Name", "Age", "Email"};
            writer.writeNext(header);

            // 写入数据
            for (String[] row : data) {
                writer.writeNext(row);
            }
        }

        System.out.println("CSV文件已生成：" + csvFilePath);
    }

    // 模拟从数据库中查询数据
    private List<String[]> fetchDataFromDatabase() {
        List<String[]> data = new ArrayList<>();
        data.add(new String[]{"1", "Alice", "25", "alice@example.com"});
        data.add(new String[]{"2", "Bob", "30", "bob@example.com"});
        data.add(new String[]{"3", "Charlie", "35", "charlie@example.com"});
        return data;
    }
}